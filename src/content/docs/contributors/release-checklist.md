---
title: Release checklist
description: Review checklist before publishing branchbrief.
---

Before release:

- Confirm CLI help and README examples match implemented behavior.
- Start from latest `main`.
- Run `npm ci`.
- Run `npm run release:check`.
- Review Markdown and JSON output examples.
- Confirm default behavior requires no API key, network access, GitHub token, or LLM.
- Confirm optional LLM and GitHub write behavior is clearly documented if present.
- Review package contents with `npm run pack:dry-run`.
- Confirm `LICENSE`, `README.md`, `package.json`, and built `dist` files are included.
- Run `npm audit --audit-level=moderate` and decide whether any finding blocks release.
- Prepare release notes with risk and rollback notes.

Publishing should happen only from `main` after the version is chosen.

Use:

```bash
npm version patch
npm publish
npm view branchbrief name version bin license
npx branchbrief --help
```

Use `minor` instead of `patch` for new CLI capabilities or output additions. Reserve `1.0.0` for stable CLI flags, default behavior, and output formats.
