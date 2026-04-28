# GitHub Actions

`branchbrief` is designed to run in GitHub Actions without write access, API keys, LLM calls, or hidden credential use. The default workflow generates a Markdown branch brief, adds it to the job summary, and uploads it as an artifact.

## Default Read-Only Workflow

Use this workflow for pull requests when you want review context without changing the pull request.

```yaml
name: Branch Brief

on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]

permissions:
  contents: read
  pull-requests: read

jobs:
  branchbrief:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Generate branch brief
        run: |
          npx branchbrief --base "${{ github.base_ref }}" --output BRANCH_BRIEF.md --copilot

      - name: Add branch brief to job summary
        run: |
          cat BRANCH_BRIEF.md >> "$GITHUB_STEP_SUMMARY"

      - name: Upload branch brief artifact
        uses: actions/upload-artifact@v4
        with:
          name: branch-brief
          path: BRANCH_BRIEF.md
```

The workflow uses:

- `contents: read` so checkout can read repository contents.
- `pull-requests: read` so pull request metadata is available to the workflow context.
- `fetch-depth: 0` so `branchbrief` can compare against the base branch.
- `$GITHUB_STEP_SUMMARY` so the generated brief appears on the Actions run summary.
- `actions/upload-artifact` so reviewers can download `BRANCH_BRIEF.md`.

## GitHub Actions Environment

When running in GitHub Actions, `branchbrief` can use these environment variables:

- `GITHUB_ACTIONS` detects whether the process is running inside GitHub Actions.
- `GITHUB_BASE_REF` provides the pull request base branch.
- `GITHUB_HEAD_REF` provides the pull request source branch.
- `GITHUB_REF_NAME` provides the current ref name.
- `GITHUB_REPOSITORY` provides the `owner/repo` identifier.
- `GITHUB_STEP_SUMMARY` points to the Markdown job summary file.

Base branch detection should still prefer an explicit `--base` value. In Actions, `${{ github.base_ref }}` is the clearest value for pull request workflows.

## Job Summary Output

The default workflow writes the branch brief to `BRANCH_BRIEF.md` first, then appends that file to `$GITHUB_STEP_SUMMARY`:

```bash
cat BRANCH_BRIEF.md >> "$GITHUB_STEP_SUMMARY"
```

This keeps the generated artifact and job summary consistent.

## Artifact Upload

Upload the generated Markdown file so the exact brief used in the run is available after the job completes:

```yaml
- name: Upload branch brief artifact
  uses: actions/upload-artifact@v4
  with:
    name: branch-brief
    path: BRANCH_BRIEF.md
```

## Optional Risk Gate

Use `--fail-on` when the workflow should fail for branches at or above a risk threshold:

```yaml
- name: Generate branch brief with risk gate
  run: |
    npx branchbrief --base "${{ github.base_ref }}" --output BRANCH_BRIEF.md --copilot --fail-on high
```

Risk order is:

```text
low < medium < high
```

For example, `--fail-on high` fails only high-risk branches. `--fail-on medium` fails medium-risk and high-risk branches.

Keep the summary and artifact steps after the risk-gated command with `if: always()` if you want the brief published even when the gate fails.

## PR Comment Mode

Posting or updating pull request comments should be treated as future V2 behavior. It requires write permissions such as `pull-requests: write`, creates visible GitHub side effects, and should be enabled only by an explicit command or flag. The default workflow intentionally does not comment on pull requests.

