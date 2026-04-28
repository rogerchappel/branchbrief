---
title: PR comment mode
description: Pull request comments are planned as explicit future V2 behavior.
---

PR comment mode is future V2 behavior.

Posting or updating comments requires GitHub write permissions and creates visible side effects on the pull request. For that reason, the default workflow intentionally does not comment on PRs.

When added, PR comments should be:

- Explicitly enabled by a command or flag.
- Documented with required permissions.
- Idempotent where possible.
- Clear about whether an existing branchbrief comment is updated or a new comment is posted.
