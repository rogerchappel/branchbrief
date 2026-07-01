# BranchBrief Launch Note Draft

BranchBrief is a local-first CLI for turning a Git branch into a structured
review brief before a pull request is opened or reviewed.

It reads local Git state and writes deterministic Markdown or JSON with branch
and base details, commits, changed files, diff stats, risk notes, suggested
verification, rollback notes, and a human decision prompt. The optional
`--copilot` flag adds review context without calling an LLM or posting comments
to GitHub.

## What is ready

- Local CLI generation from the current repository and branch.
- Markdown and JSON output modes.
- Deterministic risk notes and verification suggestions.
- Optional Copilot-readable review context with `--copilot`.
- A fixture-backed self-review demo in `demo/run-self-review.sh`.
- GitHub Actions examples for artifact upload and risk gating.

## Demo command

```sh
npm run build
bash demo/run-self-review.sh
```

The demo writes `BRANCH_BRIEF.md` and `branch-brief.json` to a temporary
directory, then checks that both outputs include the expected review facts.

## Suggested release post

BranchBrief turns a local branch into a deterministic review brief: branch and
base details, commits, changed files, diff stats, risk notes, suggested
verification, rollback notes, and optional Copilot-readable context. It works
without API keys, hosted services, or LLM calls.

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
- It does not publish npm packages automatically.
