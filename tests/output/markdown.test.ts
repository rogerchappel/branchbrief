import { strict as assert } from "node:assert";
import test from "node:test";
import { renderMarkdownBranchBrief } from "../../src/output/markdown.ts";
import { sampleBranchBriefInput } from "./fixtures.ts";

test("renders the required markdown branch brief sections", () => {
  const markdown = renderMarkdownBranchBrief(sampleBranchBriefInput);

  assert.equal(
    markdown,
    `# Branch Brief

## Overview

Repo: branchbrief
Branch: agent/output-renderers
Base: main
Generated: 2026-04-28T00:00:00.000Z
Status: clean, staged 0, unstaged 0, untracked 0

## Summary

This branch contains 2 commits affecting 3 files.

## Commits

- abc123 feat(output): generate markdown branch briefs
- def456 feat(output): support json branch briefs

## Files Changed

- src/output/markdown.ts
- src/output/json.ts
- tests/output/markdown.test.ts

## Diff Stat

3 files changed, 180 insertions(+)

## Risk Level

low

## Risk Notes

- Output-only changes
- No git or filesystem access

## Verification

Not provided.

Suggested commands:

- node --test tests/output/*.test.ts
- git diff --check

## Rollback Plan

Revert the branch or revert the listed commits.

## Human Decision Needed

Review the changed files, risk notes, and verification status before merge.
`,
  );
});

test("omits copilot review context by default", () => {
  const markdown = renderMarkdownBranchBrief(sampleBranchBriefInput);

  assert.equal(markdown.includes("## Copilot Review Context"), false);
});
