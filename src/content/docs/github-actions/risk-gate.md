---
title: Risk gate
description: Fail a workflow when branch risk meets or exceeds a threshold.
---

Use `--fail-on` when a workflow should fail for branches at or above a risk threshold.

```yaml
- name: Generate branch brief with risk gate
  run: |
    npx branchbrief --base "${{ github.base_ref }}" --output BRANCH_BRIEF.md --copilot --fail-on high
```

Risk order:

```text
low < medium < high
```

`--fail-on high` fails only high-risk branches. `--fail-on medium` fails medium-risk and high-risk branches.

If you want the summary and artifact even when the gate fails, run those steps with `if: always()`.
