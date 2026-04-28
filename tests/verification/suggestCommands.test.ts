import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { detectPackageManager } from "../../src/verification/detectPackageManager";
import { readPackageScripts } from "../../src/verification/readPackageScripts";
import { suggestVerificationCommands } from "../../src/verification/suggestCommands";

function fixturePath(name: string): string {
  return join("tests", "fixtures", "verification", name);
}

test("detects package manager from lockfiles in priority order", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "branchbrief-pm-"));

  try {
    await writeFile(join(projectRoot, "package-lock.json"), "{}");
    assert.equal(await detectPackageManager(projectRoot), "npm");

    await writeFile(join(projectRoot, "pnpm-lock.yaml"), "lockfileVersion: '9.0'");
    assert.equal(await detectPackageManager(projectRoot), "pnpm");
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});

test("detects each supported package manager lockfile", async () => {
  const cases = [
    ["pnpm-lock.yaml", "pnpm"],
    ["package-lock.json", "npm"],
    ["yarn.lock", "yarn"],
    ["bun.lockb", "bun"],
  ] as const;

  for (const [lockfile, packageManager] of cases) {
    const projectRoot = await mkdtemp(join(tmpdir(), "branchbrief-pm-"));

    try {
      await writeFile(join(projectRoot, lockfile), "");
      assert.equal(await detectPackageManager(projectRoot), packageManager);
    } finally {
      await rm(projectRoot, { recursive: true, force: true });
    }
  }
});

test("reads package.json scripts and ignores non-string script values", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "branchbrief-scripts-"));

  try {
    await writeFile(
      join(projectRoot, "package.json"),
      JSON.stringify({
        scripts: {
          test: "vitest run",
          lint: "eslint .",
          invalid: false,
        },
      }),
    );

    assert.deepEqual(await readPackageScripts(projectRoot), {
      test: "vitest run",
      lint: "eslint .",
    });
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});

test("suggests package script verification commands without running them", async () => {
  assert.deepEqual(
    await suggestVerificationCommands(fixturePath("node-pnpm/")),
    {
      provided: false,
      suggestedCommands: [
        "pnpm test",
        "pnpm run typecheck",
        "pnpm run lint",
        "pnpm run build",
      ],
      notes: [],
    },
  );
});

test("suggests common Makefile and justfile targets", async () => {
  assert.deepEqual(
    await suggestVerificationCommands(fixturePath("make-just/")),
    {
      provided: false,
      suggestedCommands: ["make test", "make lint", "just test", "just build"],
      notes: [],
    },
  );
});

test("suggests Python verification commands from configured tools", async () => {
  assert.deepEqual(
    await suggestVerificationCommands(fixturePath("python/")),
    {
      provided: false,
      suggestedCommands: ["pytest", "ruff check .", "mypy ."],
      notes: [],
    },
  );
});

test("handles missing files gracefully", async () => {
  const projectRoot = await mkdtemp(join(tmpdir(), "branchbrief-empty-"));

  try {
    assert.deepEqual(await suggestVerificationCommands(projectRoot), {
      provided: false,
      suggestedCommands: [],
      notes: ["No common verification commands detected."],
    });
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
});
