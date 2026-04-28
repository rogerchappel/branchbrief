---
title: Risk levels
description: How branchbrief classifies low, medium, and high risk branches.
---

Risk levels are deterministic review signals, not safety guarantees.

## Levels

- `low`: docs, examples, tests, or narrow output-only changes.
- `medium`: source, config, dependency, workflow, API, or larger diff changes.
- `high`: auth, security, payments, secrets, migrations, production data, infrastructure, or very large changes.

## Inputs

Risk rules can use:

- Changed paths.
- File types.
- Diff size.
- Mixed intent signals.
- Known sensitive areas.

Reviewers should treat the result as a prompt for attention, not as a merge decision.
