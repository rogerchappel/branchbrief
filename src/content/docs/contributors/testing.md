---
title: Testing
description: Verification guidance for branchbrief contributors.
---

Use the smallest relevant verification first.

Common checks:

```bash
npm test
npm run typecheck
npm run build
npm run build:docs
git diff --check
```

For narrow changes, run targeted tests when possible. For docs-site changes, `npm run build:docs` and `git diff --check` are the minimum useful checks.

Do not claim success without either running verification or clearly stating what could not be run.
