# BranchBrief Social Hooks

Draft posts grounded in the current CLI and README: local Git inspection,
Markdown/JSON output, deterministic risk notes, verification suggestions, and
optional Copilot-readable context.

## Short posts

1. BranchBrief turns a local branch into a review packet: commits, changed files,
   diff stats, risk notes, suggested checks, rollback notes, and a human
   decision prompt.
2. Before asking for review, run `branchbrief --base main --output
   BRANCH_BRIEF.md --copilot` and attach the generated brief to the PR.
3. No tokens, no hosted service, no LLM call. BranchBrief reads local Git state
   and writes deterministic Markdown or JSON for reviewers and automation.

## Demo angle

```sh
npm run build
bash demo/run-self-review.sh
```

Show both generated files: `BRANCH_BRIEF.md` for reviewers and
`branch-brief.json` for workflow automation.

