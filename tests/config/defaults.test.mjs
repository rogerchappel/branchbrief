import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { after, before, test } from "node:test";

const repoRoot = new URL("../..", import.meta.url).pathname;
const outDir = join(tmpdir(), `branchbrief-config-tests-${Date.now()}`);
const require = createRequire(import.meta.url);
let defaults;

before(async () => {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

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
      "--outDir",
      outDir,
      "src/config/defaults.ts",
    ],
    { cwd: repoRoot, stdio: "inherit" },
  );

  defaults = require(join(outDir, "config", "defaults.js"));
});

after(async () => {
  await rm(outDir, { recursive: true, force: true });
});

test("default options use markdown, risk, color, and normal output", () => {
  assert.deepEqual(defaults.DEFAULT_BRANCH_BRIEF_OPTIONS, {
    format: "markdown",
    includeRisk: true,
    includeCopilotContext: false,
    color: true,
    quiet: false,
  });
});

test("withDefaultOptions preserves explicit overrides", () => {
  assert.deepEqual(defaults.withDefaultOptions({ color: false, quiet: true }), {
    format: "markdown",
    includeRisk: true,
    includeCopilotContext: false,
    color: false,
    quiet: true,
  });
});
