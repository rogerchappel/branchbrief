# Dependency Policy

`branchbrief` uses Dependabot for routine dependency hygiene. Updates should stay reviewable, low-noise, and consistent with the project's local-first defaults.

## Dependabot Cadence

Dependabot runs weekly on Monday in the `Australia/Brisbane` timezone.

Configured update groups:

- npm development dependencies: grouped for minor and patch updates.
- npm production dependencies: grouped for patch updates only.
- GitHub Actions: grouped into one weekly Actions update.

Open Dependabot PR limits are intentionally low so dependency maintenance does not crowd out feature and release work.

## Review Expectations

Do not auto-merge major dependency updates.

Do not auto-merge production dependency updates without tests or an explicit maintainer review.

Run `branchbrief` on dependency PRs before merge so reviewers have a deterministic summary of changed files, risk notes, verification gaps, and rollback expectations.

Use the smallest relevant verification first:

- `npm test` for behavior-sensitive package updates.
- `npm run typecheck` for TypeScript, types, or build-tool updates.
- `npm run build` for packaging or compiler-adjacent updates.
- `git diff --check` for documentation-only or configuration-only updates.

## High-Risk Dependency Categories

Treat major version updates as medium or high risk by default.

Treat these dependency categories as high risk:

- auth and token handling
- payment, billing, or Stripe integrations
- crypto and signing libraries
- database, migration, or storage tooling
- build, bundling, compiler, and release tooling
- deployment and GitHub Actions runtime dependencies
- telemetry, analytics, privacy, or network behavior

High-risk dependency PRs should include explicit verification, rollback notes, and a human merge decision.
