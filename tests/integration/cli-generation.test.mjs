import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { after, before, test } from "node:test";

const repoRoot = new URL("../..", import.meta.url).pathname;
const outDir = join(tmpdir(), `branchbrief-integration-${Date.now()}`);
const require = createRequire(import.meta.url);
let cliPath;

before(async () => {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  await writeFile(
    join(outDir, "package.json"),
    await readFile(join(repoRoot, "package.json"), "utf8"),
  );

  execFileSync(
    "npx",
    [
      "tsc",
      "--target",
      "ES2022",
      "--module",
      "NodeNext",
      "--moduleResolution",
      "NodeNext",
      "--strict",
      "--types",
      "node",
      "--rewriteRelativeImportExtensions",
      "--outDir",
      outDir,
      "src/cli.ts",
    ],
    { cwd: repoRoot, stdio: "inherit" },
  );

  cliPath = join(outDir, "cli.js");
});

after(async () => {
  await rm(outDir, { recursive: true, force: true });
});

test("branchbrief outputs Markdown", async () => {
  const repo = await createFixtureRepo("markdown");
  const result = runCli(["--base", "main"], repo);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /# Branch Brief/);
  assert.match(result.stdout, /## Risk Level/);
  assert.match(result.stdout, /## Verification/);
});

test("branchbrief --json outputs valid JSON", async () => {
  const repo = await createFixtureRepo("json");
  const result = runCli(["--base", "main", "--json"], repo);

  assert.equal(result.status, 0);
  const json = JSON.parse(result.stdout);
  assert.equal(json.branch.base, "main");
  assert.match(json.repo.name, /^branchbrief-json-/);
  assert.ok(Array.isArray(json.filesChanged));
});

test("branchbrief --output writes a file", async () => {
  const repo = await createFixtureRepo("output");
  const outputPath = join(repo, "BRANCH_BRIEF.md");
  const result = runCli(["--base", "main", "--output", outputPath], repo);

  assert.equal(result.status, 0);
  assert.equal(result.stdout, "");
  assert.match(await readFile(outputPath, "utf8"), /# Branch Brief/);
});

test("branchbrief --copilot includes Copilot Review Context", async () => {
  const repo = await createFixtureRepo("copilot");
  const result = runCli(["--base", "main", "--copilot"], repo);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /## Copilot Review Context/);
});

test("branchbrief --fail-on high exits non-zero for high-risk files", async () => {
  const repo = await createFixtureRepo("fail-high", {
    highRisk: true,
  });
  const result = runCli(["--base", "main", "--fail-on", "high"], repo);

  assert.equal(result.status, 3);
  assert.match(result.stdout, /# Branch Brief/);
  assert.match(result.stderr, /Risk gate failed/);
});

test("branchbrief reports a missing base branch clearly", async () => {
  const repo = await createFixtureRepo("missing-base");
  const result = runCli(["--base", "does-not-exist"], repo);

  assert.equal(result.status, 2);
  assert.match(result.stderr, /Base branch could not be found/);
  assert.match(result.stderr, /Fetch the base branch/);
});

test("branchbrief --help works", () => {
  const result = runCli(["--help"], repoRoot);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Usage:/);
});

test("branchbrief --version works", async () => {
  const packageJson = require(join(repoRoot, "package.json"));
  const result = runCli(["--version"], repoRoot);

  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), packageJson.version);
});

async function createFixtureRepo(name, options = {}) {
  const repo = await mkdtemp(join(tmpdir(), `branchbrief-${name}-`));
  git(repo, ["init", "-b", "main"]);
  git(repo, ["config", "user.email", "branchbrief@example.test"]);
  git(repo, ["config", "user.name", "Branchbrief Test"]);

  await writeFile(
    join(repo, "package.json"),
    JSON.stringify({
      scripts: {
        test: "node --test",
        build: "tsc --noEmit",
      },
    }),
  );
  await writeFile(join(repo, "README.md"), "# Fixture\n");
  git(repo, ["add", "."]);
  git(repo, ["commit", "-m", "chore: initial commit"]);
  git(repo, ["switch", "-c", "feature/test-branch"]);

  const changedPath = options.highRisk
    ? join(repo, "src", "auth", "token.ts")
    : join(repo, "src", "feature.ts");
  await mkdir(dirname(changedPath), { recursive: true });
  await writeFile(changedPath, "export const value = 1;\n");
  git(repo, ["add", "."]);
  git(repo, ["commit", "-m", "feat: add fixture change"]);

  return repo;
}

function git(cwd, args) {
  execFileSync("git", args, { cwd, stdio: "pipe" });
}

function runCli(args, cwd) {
  const result = spawnSync("node", [cliPath, ...args], {
    cwd,
    encoding: "utf8",
  });

  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}
