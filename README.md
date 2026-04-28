# branchbrief

Turn any branch into a reviewable, auditable brief for humans and AI reviewers.

`branchbrief` is planned as a local-first CLI and GitHub Action that converts branch state into a structured review brief: commits, changed files, diff stats, risk flags, verification gaps, rollback notes, and agent-ready review context.

The product requirements document is available at [docs/PRD.md](docs/PRD.md).

## CLI

The package exposes a `branchbrief` command:

```bash
branchbrief --help
branchbrief --version
branchbrief --base main
branchbrief --output BRANCH_BRIEF.md
branchbrief --json
branchbrief --copilot --fail-on high
```

Default CLI options render Markdown, include deterministic risk information,
omit Copilot context, keep color enabled, and print normal output. Generation
currently fails with a clear integration error until the git, risk, output, and
verification modules are wired together.

GitHub Actions usage is documented at [docs/github-actions.md](docs/github-actions.md).
