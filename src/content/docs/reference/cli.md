---
title: branchbrief CLI reference
description: Reference for the branchbrief command and supported options.
---

## Command

```bash
branchbrief [options]
```

Generates a branch brief from local git state.

## Options

| Option | Purpose |
| --- | --- |
| `--base <branch>` | Sets the base branch for comparison. |
| `--output <path>` | Writes the brief to a file instead of stdout. |
| `--json` | Renders JSON instead of Markdown. |
| `--copilot` | Adds Copilot-compatible review context. |
| `--fail-on <level>` | Exits non-zero when risk is at or above `low`, `medium`, or `high`. |
| `--repo-root <path>` | Runs against a specific repository root. |
| `--quiet` | Reduces non-essential output. |
| `--no-color` | Disables terminal color output. |

## Examples

```bash
branchbrief --base main
branchbrief --base main --output BRANCH_BRIEF.md
branchbrief --base main --json --output branch-brief.json
branchbrief --base main --copilot --fail-on high
branchbrief --repo-root . --base origin/main --no-color
```
