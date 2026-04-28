---
title: Agent work plan
description: How agents should keep branchbrief work reviewable.
---

Agent work should stay small, auditable, and reversible.

Recommended flow:

1. Work from a branch based on latest `main`.
2. Keep one commit per reviewable intent.
3. Avoid touching runtime, output schema, GitHub write behavior, LLM behavior, or config formats without explicit scope.
4. Run the smallest relevant verification.
5. Return a review pack with risk, rollback, and human decisions.

For docs work, prefer focused pages under `src/content/docs/` and avoid unrelated runtime edits.
