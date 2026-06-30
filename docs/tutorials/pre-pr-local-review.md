# Pre-PR Local Review Recipe

Use this recipe before opening a pull request when you want a local, reviewable
summary of the branch.

## Run the Demo

```sh
npm install
npm run build
bash demo/run-self-review.sh
```

The demo generates two temporary artifacts and verifies that they include the
expected review sections:

- `BRANCH_BRIEF.md`: Markdown for a human reviewer.
- `branch-brief.json`: structured facts for automation.

## Run It on Your Branch

```sh
branchbrief --base main --output BRANCH_BRIEF.md --copilot
branchbrief --base main --json --output branch-brief.json
```

Commit the brief only when your project wants generated review packets in git.
For most workflows, attach the Markdown to a pull request description or upload
the JSON as a CI artifact.

## What to Check Before Sharing

- The base branch is correct and exists locally.
- The changed-file list matches the intended review scope.
- The risk notes mention any generated files, dependency changes, or CI edits.
- The suggested verification commands were actually run or explicitly skipped.
- The rollback note is realistic for the change.

## Guardrails

- BranchBrief does not call an LLM or GitHub API.
- The `--copilot` section is local review context, not an automatic PR comment.
- Risk notes and verification suggestions are deterministic hints; they do not
  replace maintainer judgment.
