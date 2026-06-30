# Launch Note Draft: Local Self-Review Briefs

BranchBrief helps maintainers package a branch for review before asking another
person or agent to inspect it.

## What to Announce

- Generate Markdown or JSON review briefs from local Git state.
- Include branch/base details, commits, changed files, diff stats, risk notes,
  verification suggestions, rollback notes, and a human decision prompt.
- Add Copilot-readable review context with `--copilot` without sending data to a
  hosted service.
- Use `--fail-on <level>` in CI when teams want deterministic risk gates.

## Demo Command

```sh
npm install
npm run build
bash demo/run-self-review.sh
```

## Good Screenshot Targets

- The top of the generated `BRANCH_BRIEF.md`.
- The risk and verification sections.
- The generated `branch-brief.json` opened beside the Markdown.

## Boundaries

- BranchBrief needs the base ref to exist in the checkout.
- It summarizes local Git facts; it does not replace code review.
- Suggested verification commands are prompts for maintainers to run and record.
