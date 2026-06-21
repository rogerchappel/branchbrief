# BranchBrief Launch Note Draft

BranchBrief is a local-first CLI for turning a Git branch into a structured
review brief before a pull request is opened or reviewed.

It reads local Git state and writes deterministic Markdown or JSON with branch
and base details, commits, changed files, diff stats, risk notes, suggested
verification, rollback notes, and a human decision prompt. The optional
`--copilot` flag adds review context without calling an LLM or posting comments
to GitHub.

## Demo command

```sh
npm run build
bash demo/run-self-review.sh
```

The demo generates both `BRANCH_BRIEF.md` and `branch-brief.json` in a temporary
directory and checks that the expected review sections are present.

## Useful angles

- For maintainers: attach a generated brief to a PR so reviewers see the shape of
  the change first.
- For CI: run with `--fail-on high` when a branch should stop on deterministic
  risk signals.
- For AI-assisted review: include `--copilot` to keep the review context explicit
  and inspectable.

## Boundaries

- BranchBrief needs local Git history that includes the requested base ref.
- Suggested verification commands are hints, not proof that checks were run.
- Human review is still required for merge decisions.
