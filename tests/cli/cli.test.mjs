import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { after, before, test } from "node:test";

const repoRoot = new URL("../..", import.meta.url).pathname;
const outDir = join(tmpdir(), `branchbrief-cli-tests-${Date.now()}`);
const require = createRequire(import.meta.url);
let cli;

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

  cli = require(join(outDir, "cli.js"));
});

after(async () => {
  await rm(outDir, { recursive: true, force: true });
});

test("--help exits cleanly and prints useful help", async () => {
  const io = captureIo();
  const exitCode = await cli.runCli(["--help"], io);

  assert.equal(exitCode, 0);
  assert.match(io.stdout.value, /Usage:/);
  assert.match(io.stdout.value, /--base <branch>/);
  assert.equal(io.stderr.value, "");
});

test("--version exits cleanly and prints package version", async () => {
  const packageJson = JSON.parse(
    await readFile(join(repoRoot, "package.json"), "utf8"),
  );
  const io = captureIo();
  const exitCode = await cli.runCli(["--version"], io);

  assert.equal(exitCode, 0);
  assert.equal(io.stdout.value.trim(), packageJson.version);
  assert.equal(io.stderr.value, "");
});

test("parses default options", () => {
  assert.deepEqual(cli.parseCliArgs([]), {
    kind: "generate",
    options: {
      format: "markdown",
      includeRisk: true,
      includeCopilotContext: false,
      color: true,
      quiet: false,
    },
  });
});

test("parses V1 flags into branch brief options", () => {
  assert.deepEqual(
    cli.parseCliArgs([
      "--base",
      "main",
      "--output",
      "BRANCH_BRIEF.md",
      "--json",
      "--risk",
      "--copilot",
      "--fail-on",
      "high",
      "--repo-root",
      ".",
      "--no-color",
      "--quiet",
    ]),
    {
      kind: "generate",
      options: {
        base: "main",
        output: "BRANCH_BRIEF.md",
        format: "json",
        includeRisk: true,
        includeCopilotContext: true,
        failOn: "high",
        repoRoot: ".",
        color: false,
        quiet: true,
      },
    },
  );
});

test("accepts the generate command alias", () => {
  assert.deepEqual(cli.parseCliArgs(["generate", "--base", "main"]), {
    kind: "generate",
    options: {
      base: "main",
      format: "markdown",
      includeRisk: true,
      includeCopilotContext: false,
      color: true,
      quiet: false,
    },
  });
});

test("invalid --fail-on value shows a clear error", async () => {
  const io = captureIo();
  const exitCode = await cli.runCli(["--fail-on", "critical"], io);

  assert.equal(exitCode, 1);
  assert.match(
    io.stderr.value,
    /Invalid --fail-on value: expected low, medium, or high\./,
  );
  assert.match(io.stderr.value, /Received: critical/);
});

test("generation fails gracefully outside a git repository", async () => {
  const nonRepo = join(outDir, "not-a-repo");
  await mkdir(nonRepo, { recursive: true });

  const io = captureIo();
  const exitCode = await cli.runCli(["--repo-root", nonRepo], io);

  assert.equal(exitCode, 2);
  assert.match(io.stderr.value, /Not inside a git repository/);
  assert.match(io.stderr.value, /--repo-root <path>/);
});

function captureIo() {
  return {
    stdout: captureStream(),
    stderr: captureStream(),
  };
}

function captureStream() {
  return {
    value: "",
    write(chunk) {
      this.value += chunk;
    },
  };
}
