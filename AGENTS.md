# Repository Agent Guide
Version: 2026-04-28

## Purpose

This repository exists to build `branchbrief`: a local-first CLI and GitHub Action that turns branch state into a reviewable, auditable brief for humans and AI reviewers.

## Repository Type

Current type:

> community OSS

## Default Mode

Work on a branch unless explicitly told otherwise.

Use atomic commits.

Keep PRs reviewable.

Verify before completion.

Return a review pack.

Do not merge without explicit human approval.

## Repo Layout

- `README.md` - project overview
- `docs/PRD.md` - product requirements and roadmap
- `branchbrief/` - future CLI implementation package
- `.github/workflows/` - future CI and GitHub Action workflows
- `tests/` - future automated tests
- `examples/` - future example outputs and fixtures

## Commands

Install:

```bash
# No package install command exists yet.
```

Test:

```bash
# No automated test command exists yet.
```

Lint:

```bash
# No lint command exists yet.
```

Typecheck:

```bash
# No typecheck command exists yet.
```

Build:

```bash
# No build command exists yet.
```

Smoke test:

```bash
git diff --check
```

## Work Policy

Before editing, report:

1. objective
2. expected blast radius
3. files likely to change
4. commit plan
5. verification plan
6. risk level

Then:

1. branch from latest `main`
2. make the smallest coherent change
3. review `git status`
4. review `git diff`
5. stage only intended files
6. run the smallest relevant verification
7. commit atomically
8. rebase before PR
9. open a focused PR
10. return a review pack

## Commit Policy

Use Conventional Commits.

One commit equals one reviewable intent.

File count is not the commit boundary.

Split commits when the work introduces independently reviewable parts, such as:

- public contracts or types
- implementation
- tests
- examples or fixtures
- documentation
- generated artifacts
- CI/config changes

Keep them together only when splitting would create artificial commits that cannot be understood or verified independently.

Allowed commit types:

- `feat:` user-visible capability
- `fix:` bug fix
- `test:` tests only
- `docs:` documentation only
- `refactor:` internal change with no behaviour change
- `ci:` CI/build/release workflow
- `chore:` repo hygiene
- `perf:` performance improvement
- `types:` type-only change

Do not mix:

- implementation and unrelated docs
- tests for one feature with implementation of another
- dependency bumps and behaviour changes
- formatting-only changes and logic changes
- generated files and unrelated hand-written code
- CI changes and application behaviour changes

Prefer 3 clean commits over 1 mixed commit.

Prefer 1 clean commit over 5 artificial commits.

## PR Policy

Good PRs:

- can be reviewed in under 15 minutes
- have a clear summary
- have focused commits
- include verification
- explain risk
- include follow-up tasks if incomplete

Bad PRs:

- broad rewrites
- unrelated formatting churn
- mixed behaviour/config/dependency changes
- no tests or verification
- vague summary
- risky workflow changes without approval

Do not merge without explicit human approval.

## Stop Before Touching

Ask before changing:

- network access
- LLM/provider calls
- GitHub write actions
- PR commenting behaviour
- release publishing
- telemetry/privacy behaviour
- auth or token handling
- secrets
- environment variables
- config formats
- public CLI commands
- GitHub Action inputs or outputs
- generated output schema
- destructive commands
- major dependency upgrades
- licensing

## branchbrief-Specific Policy

`branchbrief` must stay local-first by default.

Default behaviour must not require:

- API keys
- network access
- LLM calls
- GitHub tokens
- hidden credential use

Facts must come from deterministic sources before any optional AI enhancement.

Do not silently call:

- OpenAI
- Anthropic
- OpenRouter
- Copilot
- Ollama
- any local or remote model provider

Optional AI use must be explicit in command names, flags, docs, and review notes.

For risk detection work, keep rules auditable and path/config driven where possible.

For GitHub Action work, preserve safe defaults and document required permissions.

For output formats, treat Markdown and JSON shape as public interfaces once released.

## Verification

Every task must include verification.

Use the smallest relevant check first:

- targeted unit test
- targeted integration test
- typecheck
- lint
- build
- smoke command
- manual QA checklist

If verification cannot be run, explain why and provide the exact command that should be run.

Do not claim success without either running verification or clearly stating that verification was not run.

## Review Pack Required

At the end of every task, return:

```md
## Review Pack
Repo:
Branch:
PR:
Task:
Status:
Summary:
Commits:
Files changed:
Verification:
Risk level:
Rollback plan:
Human decision needed:
Next recommended task:
```
