---
title: Copilot context
description: Generate Copilot-compatible review context without depending on Copilot.
---

`branchbrief --copilot` adds a section written for Copilot and other AI reviewers.

The output should focus attention on:

- Risk level.
- Sensitive files changed.
- Public API changes.
- Config or CI changes.
- Missing tests.
- Verification gaps.
- Rollback concerns.

## Copilot-Compatible Output

The Copilot section is plain Markdown and remains useful to humans.

## Copilot Review Context

V1 must not request a Copilot review automatically. It only prepares review context.

## `.github/copilot-instructions.md`

Generating repository-level Copilot instructions is planned for V2.

## Optional by Design

Copilot support is optional. The local CLI and default GitHub Actions workflow should remain useful without Copilot.
