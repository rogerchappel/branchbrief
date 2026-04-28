---
title: Job summary workflow
description: Publish a branch brief to a GitHub Actions job summary.
---

The default workflow should be read-only. It generates a branch brief, adds it to the Actions job summary, and uploads the exact Markdown file as an artifact.

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
        run: |
          npx branchbrief --base "${{ github.base_ref }}" --output BRANCH_BRIEF.md --copilot

      - name: Add branch brief to job summary
        run: |
          cat BRANCH_BRIEF.md >> "$GITHUB_STEP_SUMMARY"
```

Use `fetch-depth: 0` so git comparison against the base branch has enough history.
