# Launch Note Draft

BranchBrief helps maintainers turn local Git history into a review packet
before a pull request is opened or while review is in progress.

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

## Boundaries

BranchBrief needs local Git history and a reachable base ref. It does not
replace human review, run the suggested verification commands, or publish npm
packages automatically.
