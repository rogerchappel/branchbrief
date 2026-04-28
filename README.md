# branchbrief

Turn any branch into a reviewable, auditable brief for humans and AI reviewers.

`branchbrief` is a local-first CLI that reads git state and generates a structured review brief: branch/base details, commits, changed files, diff stats, risk flags, verification gaps, rollback notes, and optional Copilot-readable review context.

The default workflow is intentionally deterministic:

- no API keys
- no network calls
- no LLM calls
- no GitHub token
- no hidden credential use

## Status

`branchbrief` is early open-source software. The local CLI, Markdown output, JSON output, deterministic risk notes, verification suggestions, examples, tests, GitHub Actions usage docs, and npm release guidance are present.

The package is prepared for public npm publishing, but maintainers must run the release checklist and publish manually. `npx branchbrief` works after the `branchbrief` package is published to npm.

## What It Generates

Generated briefs are designed to answer the questions reviewers usually ask first:

- What branch is being reviewed?
- What base branch is it compared against?
- Which commits are included?
- Which files changed?
- How large is the diff?
- Which risk signals were detected?
- Which verification commands are suggested?
- What rollback path should reviewers expect?
- What decision still needs a human?

See:

- [Documentation site](https://branchbrief.rogerchappel.com)
- [Markdown example](examples/BRANCH_BRIEF.example.md)
- [JSON example](examples/branch-brief.example.json)
- [Product requirements](docs/PRD.md)
- [GitHub Actions guide](docs/github-actions.md)
- [Release guide](docs/release.md)

## Requirements

- Node.js `>=22`
- npm
- git repository history that includes the base branch you want to compare against

For GitHub Actions, use `actions/checkout` with `fetch-depth: 0` so the base branch and merge base are available.

## Install

From this repository:

```bash
npm install
npm run build
```

To run the CLI from the built package locally:

```bash
node dist/cli.js --help
```

For local command development, link the package after building:

```bash
npm link
branchbrief --help
```

After the package is published to npm, expected usage is:

```bash
npx branchbrief --help
```

`npx` resolves packages from npm. It does not deploy the package itself.

## Quickstart

From a feature branch:

```bash
branchbrief --base main --output BRANCH_BRIEF.md
```

Open `BRANCH_BRIEF.md` and review the generated summary, risk notes, suggested verification, rollback plan, and human decision needed.

Generate JSON for automation:

```bash
branchbrief --base main --json --output branch-brief.json
```

Include Copilot-readable review context:

```bash
branchbrief --base main --output BRANCH_BRIEF.md --copilot
```

Fail a command or CI job when the generated risk level meets a threshold:

```bash
branchbrief --base main --copilot --fail-on high
```

Risk thresholds are ordered:

```text
low < medium < high
```

## CLI Reference

```bash
branchbrief [options]
branchbrief generate [options]
```

Options:

| Option | Purpose |
| --- | --- |
| `--base <branch>` | Base branch to compare against. |
| `--output <file>` | Write the generated brief to a file instead of stdout. |
| `--json` | Render JSON instead of Markdown. |
| `--risk` | Include deterministic risk information. Enabled by default. |
| `--copilot` | Include Copilot-readable review context. |
| `--fail-on <level>` | Exit non-zero when risk is at or above `low`, `medium`, or `high`. |
| `--repo-root <path>` | Inspect a specific repository root. |
| `--no-color` | Disable colorized terminal output. |
| `--quiet` | Suppress non-error output. |
| `--version`, `-v` | Print the package version. |
| `--help`, `-h` | Print help. |

Examples:

```bash
branchbrief
branchbrief --base main
branchbrief --base origin/main --output BRANCH_BRIEF.md
branchbrief --base main --json --output branch-brief.json
branchbrief --base main --copilot --fail-on high
branchbrief --repo-root . --base origin/main --no-color
```

## GitHub Actions

`branchbrief` can run in GitHub Actions as a read-only workflow. This example writes the brief to the job summary and uploads the exact Markdown artifact.

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

See [docs/github-actions.md](docs/github-actions.md) for risk gates, artifact upload notes, and PR comment policy.

## Local-First Policy

`branchbrief` must stay useful without network access, provider credentials, or model calls.

Facts should come from deterministic sources first:

- local git metadata
- local repository files
- explicit command-line options
- documented configuration

Optional AI, GitHub write actions, PR comments, labels, or provider integrations should be explicit in command names, flags, permissions, and documentation. They should never be hidden behind default behavior.

## Development

Install dependencies:

```bash
npm install
```

Run tests:

```bash
npm test
```

Run the TypeScript typecheck:

```bash
npm run typecheck
```

Build the CLI:

```bash
npm run build
```

Build the documentation site:

```bash
npm run build:docs
```

Run the docs site locally:

```bash
npm run dev:docs
```

Run the minimal whitespace check:

```bash
git diff --check
```

Run the full release readiness check:

```bash
npm run release:check
```

Inspect the npm package contents without publishing:

```bash
npm run pack:dry-run
```

## Project Layout

```text
src/cli.ts                         CLI parsing and command execution
src/index.ts                       Branch brief generation entry point
src/git/                           Local git fact collection
src/risk/                          Deterministic risk classification
src/output/                        Markdown, JSON, and Copilot context renderers
src/verification/                  Suggested verification command detection
src/content/docs/                  Documentation site source
docs/                              Project and GitHub Actions docs
examples/                          Example generated outputs and workflows
tests/                             Unit and integration tests
```

## Contributing

Contributions should keep the project small, auditable, and local-first.

Before opening a pull request:

1. Keep the change focused on one reviewable intent.
2. Add or update tests for behavior changes.
3. Run the smallest relevant verification command.
4. Include the verification result in the pull request.
5. Call out any risk around public output formats, CLI flags, GitHub permissions, or provider integrations.

Use Conventional Commits for commit messages:

```text
feat: add a user-visible capability
fix: correct a bug
test: add or update tests
docs: update documentation
refactor: change internals without behavior changes
ci: update CI or release automation
chore: repository hygiene
perf: improve performance
types: type-only changes
```

## Open-Source Readiness Checklist

Current repository strengths:

- Local-first product principles are documented.
- CLI behavior is covered by tests.
- Markdown and JSON examples are included.
- GitHub Actions usage is documented with read-only defaults.
- Documentation site source exists under `src/content/docs`.

Recommended before announcing a public release:

- Confirm `npm run release:check` passes from a clean checkout.
- Confirm `npm run pack:dry-run` includes the intended package files.
- Confirm `npm audit --audit-level=moderate` has no release-blocking findings, or document accepted risk.
- Decide whether PR comments, labels, or GitHub write actions belong in V1 or later.
- Publish from latest `main`, not from a feature branch.
- Create a GitHub release for the published npm version.

## Releases

`branchbrief` uses npm package versions and GitHub releases.

While the project is pre-1.0:

- use patch versions for fixes and release hygiene
- use minor versions for new CLI capabilities or output additions
- reserve `1.0.0` for stable CLI flags, default behavior, and output formats

See [docs/release.md](docs/release.md) for the maintainer release flow.

## License

MIT. See [LICENSE](LICENSE).
