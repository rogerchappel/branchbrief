---
title: Quickstart
description: Generate a Markdown branch brief from local git state.
---

From a git branch you want reviewed:

```bash
branchbrief --base main --output BRANCH_BRIEF.md
```

Open `BRANCH_BRIEF.md` and review:

- Branch and base details.
- Commits since base.
- Changed files.
- Diff stats.
- Risk level and risk notes.
- Suggested verification commands.
- Human decision needed.

Add Copilot-compatible review context only when you want it:

```bash
branchbrief --base main --output BRANCH_BRIEF.md --copilot
```

Generate JSON for automation:

```bash
branchbrief --base main --json --output branch-brief.json
```
