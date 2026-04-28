---
title: Local CLI usage
description: Use branchbrief without network access, tokens, or LLM calls.
---

The core command reads local git state and writes a branch brief.

```bash
branchbrief
```

Default behavior should:

- Render Markdown to stdout.
- Detect the current branch.
- Detect or accept the base branch.
- Collect commits, changed files, diff stats, and working tree status.
- Classify risk from deterministic rules.
- Suggest verification commands.
- Avoid network access and LLM calls.

Use `--repo-root` when running from outside the repository root:

```bash
branchbrief --repo-root /path/to/repo --base main
```
