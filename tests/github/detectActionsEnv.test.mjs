import assert from "node:assert/strict";
import { test } from "node:test";

import { detectActionsEnv } from "../../src/github/detectActionsEnv.mjs";

test("detectActionsEnv maps GitHub Actions environment variables", () => {
  assert.deepEqual(
    detectActionsEnv({
      GITHUB_ACTIONS: "true",
      GITHUB_BASE_REF: "main",
      GITHUB_HEAD_REF: "feature-branch",
      GITHUB_REF_NAME: "123/merge",
      GITHUB_REPOSITORY: "rogerchappel/branchbrief",
      GITHUB_STEP_SUMMARY: "/tmp/summary.md",
    }),
    {
      isGitHubActions: true,
      baseRef: "main",
      headRef: "feature-branch",
      refName: "123/merge",
      repository: "rogerchappel/branchbrief",
      stepSummaryPath: "/tmp/summary.md",
    },
  );
});

test("detectActionsEnv treats missing or empty values as null", () => {
  assert.deepEqual(
    detectActionsEnv({
      GITHUB_ACTIONS: "false",
      GITHUB_BASE_REF: "",
    }),
    {
      isGitHubActions: false,
      baseRef: null,
      headRef: null,
      refName: null,
      repository: null,
      stepSummaryPath: null,
    },
  );
});

