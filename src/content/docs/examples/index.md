---
title: Examples
description: Example Markdown, JSON, and GitHub Actions outputs.
---

## Example Branch Brief

```md
# Branch Brief

## Overview

Repo: branchbrief
Branch: agent/output-renderers
Base: main
Generated: 2026-04-28T00:00:00.000Z
Status: clean, staged 0, unstaged 0, untracked 0

## Summary

This branch contains 2 commits affecting 3 files.

## Risk Level

low

## Verification

Not provided.

Suggested commands:

- node --test tests/output/*.test.ts
- git diff --check
```

## Example JSON Output

```json
{
  "repo": {
    "name": "branchbrief",
    "root": "/path/to/branchbrief",
    "remote": "git@github.com:rogerchappel/branchbrief.git"
  },
  "branch": {
    "current": "agent/output-renderers",
    "base": "main",
    "mergeBase": "abc123"
  },
  "risk": {
    "level": "low",
    "notes": ["Output-only changes"]
  },
  "verification": {
    "provided": false,
    "suggestedCommands": ["node --test tests/output/*.test.ts", "git diff --check"]
  }
}
```

## Example GitHub Action Workflow

```yaml
name: Branch Brief

on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]

permissions:
  contents: read
  pull-requests: read

jobs:
  branchbrief:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - name: Generate branch brief
        run: npx branchbrief --base "${{ github.base_ref }}" --output BRANCH_BRIEF.md --copilot
      - name: Add branch brief to job summary
        run: cat BRANCH_BRIEF.md >> "$GITHUB_STEP_SUMMARY"
      - name: Upload branch brief artifact
        uses: actions/upload-artifact@v4
        with:
          name: branch-brief
          path: BRANCH_BRIEF.md
```
