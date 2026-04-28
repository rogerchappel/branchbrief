---
title: What is branchbrief?
description: Learn what branchbrief generates and why it is local-first by default.
---

`branchbrief` turns a git branch into a reviewable, auditable brief for humans and AI reviewers.

The brief is designed to answer the questions a reviewer has before opening a large diff:

- What changed?
- Which commits and files are involved?
- How risky does the branch look?
- What verification appears to be missing?
- What context should a human or AI reviewer focus on?

The default mode is deterministic and local. It should not need API keys, network access, GitHub tokens, or LLM calls.

## Output Formats

The planned V1 CLI supports Markdown by default and JSON with `--json`.

Markdown is intended for PR descriptions, job summaries, handoff notes, and review packets. JSON is intended for automation and future policy integrations.
