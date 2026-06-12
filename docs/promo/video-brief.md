# BranchBrief Video Brief

## Promise

Show how a maintainer can turn a local branch into a reviewable brief before
opening or reviewing a pull request.

## Demo flow

1. Start on a branch with a small docs or example change.
2. Run:

   ```sh
   npm run build
   bash demo/run-self-review.sh
   ```

3. Open the printed `BRANCH_BRIEF.md` path.
4. Point out the branch/base summary, commit list, changed files, risk notes,
   suggested verification, rollback plan, and Copilot review context.
5. Open the printed `branch-brief.json` path to show the same facts can feed
   automation.

## Talk track

- BranchBrief is local-first: no API keys, no network calls, and no LLM calls.
- The output is deterministic Markdown or JSON that reviewers can inspect.
- `--copilot` adds review context without posting comments or mutating GitHub.
- `--fail-on high` can be used in CI when teams want a risk gate.

## Boundaries to mention

- It reads local Git state and needs the base ref to exist in the checkout.
- It does not replace human review.
- Suggested verification commands are hints; maintainers still run and record
  the checks relevant to the branch.

