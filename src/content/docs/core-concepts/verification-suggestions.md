---
title: Verification suggestions
description: How branchbrief suggests relevant checks without running them.
---

`branchbrief` suggests verification commands from repository shape.

For Node.js projects, it can inspect package scripts and suggest commands such as:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

For other common project files, it can suggest targeted commands such as:

```bash
make test
just test
pytest
ruff check .
mypy .
git diff --check
```

V1 should suggest commands only. Running tests remains an explicit human or CI action.
