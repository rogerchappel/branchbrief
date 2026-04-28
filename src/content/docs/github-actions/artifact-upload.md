---
title: Artifact upload
description: Preserve the generated branch brief as a workflow artifact.
---

Upload the generated Markdown file so reviewers can inspect the exact branch brief used by the workflow.

```yaml
- name: Upload branch brief artifact
  uses: actions/upload-artifact@v4
  with:
    name: branch-brief
    path: BRANCH_BRIEF.md
```

This keeps the job summary convenient while preserving an auditable file.
