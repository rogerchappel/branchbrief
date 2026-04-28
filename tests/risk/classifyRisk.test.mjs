import assert from "node:assert/strict";
import { mkdir, rm } from "node:fs/promises";
import { after, test } from "node:test";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";

const repoRoot = new URL("../..", import.meta.url).pathname;
const outDir = join(tmpdir(), `branchbrief-risk-tests-${Date.now()}`);

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

execFileSync(
  "tsc",
  [
    "--target",
    "ES2022",
    "--module",
    "NodeNext",
    "--moduleResolution",
    "NodeNext",
    "--strict",
    "--rewriteRelativeImportExtensions",
    "--outDir",
    outDir,
    "src/risk/index.ts",
  ],
  { cwd: repoRoot, stdio: "inherit" },
);

const { classifyRisk } = await import(
  pathToFileURL(join(outDir, "risk", "index.js")).href
);

after(async () => {
  await rm(outDir, { recursive: true, force: true });
});

test("classifies high-risk paths", () => {
  const result = classifyRisk({
    changedFiles: ["src/auth/session.ts"],
    diffStat: { files: 1, insertions: 12, deletions: 3 },
  });

  assert.equal(result.level, "high");
  assert.ok(result.signals.some((signal) => signal.id === "path.high"));
  assert.ok(result.notes.some((note) => note.includes("High-risk path")));
});

test("classifies medium-risk paths", () => {
  const result = classifyRisk({
    changedFiles: ["package.json"],
    diffStat: { files: 1, insertions: 6, deletions: 2 },
  });

  assert.equal(result.level, "medium");
  assert.ok(result.signals.some((signal) => signal.id === "path.medium"));
});

test("keeps docs, tests, and examples-only changes low risk", () => {
  const result = classifyRisk({
    changedFiles: ["README.md", "docs/PRD.md", "tests/risk/example.test.ts"],
    diffStat: { files: 3, insertions: 30, deletions: 4 },
  });

  assert.equal(result.level, "low");
  assert.ok(result.signals.some((signal) => signal.id === "path.low_only"));
});

test("escalates risk for large file counts and line deltas", () => {
  const medium = classifyRisk({
    changedFiles: ["src/index.ts"],
    diffStat: { files: 21, insertions: 900, deletions: 50 },
  });
  const high = classifyRisk({
    changedFiles: ["src/index.ts"],
    diffStat: { files: 51, insertions: 4_000, deletions: 1_001 },
  });

  assert.equal(medium.level, "medium");
  assert.ok(
    medium.signals.some((signal) => signal.id === "diff_size.files.medium"),
  );
  assert.equal(high.level, "high");
  assert.ok(high.signals.some((signal) => signal.id === "diff_size.files.high"));
  assert.ok(high.signals.some((signal) => signal.id === "diff_size.lines.high"));
});

test("flags mixed intent across source, dependencies, and CI", () => {
  const result = classifyRisk({
    changedFiles: [
      "src/risk/classifyRisk.ts",
      "package.json",
      ".github/workflows/ci.yml",
    ],
    diffStat: { files: 3, insertions: 80, deletions: 8 },
  });

  assert.equal(result.level, "medium");
  assert.ok(result.signals.some((signal) => signal.id === "branch.mixed_intent"));
  assert.ok(result.notes.some((note) => note.includes("Mixed branch intent")));
});
