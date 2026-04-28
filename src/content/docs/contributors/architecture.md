---
title: Architecture
description: High-level branchbrief architecture for contributors.
---

`branchbrief` is organized around deterministic facts first.

## Planned Modules

- CLI parsing and command orchestration.
- Git fact collection.
- Base branch detection.
- Risk classification.
- Verification suggestion detection.
- Markdown output.
- JSON output.
- Optional Copilot context.
- Future GitHub and LLM integrations.

## Design Boundary

The local CLI should remain useful without network access, tokens, or LLM providers. Optional integrations should sit behind explicit commands or flags.
