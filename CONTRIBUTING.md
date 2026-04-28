# Contributing

Thanks for improving `branchbrief`.

This project is local-first by default. Contributions should preserve deterministic behavior unless an optional integration is explicitly named, configured, and documented.

## Before You Start

- Open or comment on an issue for broad behavior changes.
- Keep pull requests focused on one reviewable intent.
- Avoid mixing behavior changes, dependency changes, generated files, and unrelated formatting.
- Do not add hidden network calls, LLM calls, GitHub write actions, credential use, or telemetry.

## Development Setup

```bash
npm install
npm test
npm run typecheck
npm run build
```

For documentation changes:

```bash
npm run build:docs
git diff --check
```

## Commit Style

Use Conventional Commits:

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

## Pull Requests

Include:

- what changed
- why it changed
- verification run
- risk level
- rollback plan
- any human decision still needed

Call out changes to public surfaces clearly:

- CLI flags
- Markdown or JSON output shape
- GitHub Action permissions
- package contents
- config formats
- provider or network behavior

## Release Changes

Do not publish to npm, create GitHub releases, or push release tags from a contribution PR unless a maintainer explicitly asks for that release operation.
