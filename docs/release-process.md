# Release Process

This process keeps branchbrief releases repeatable, reviewable, and safe. It is
for maintainers and release agents preparing an npm and GitHub release.

## Release Principles

- Keep default behavior local-first.
- Prefer deterministic checks before manual release decisions.
- Treat CLI flags, exit codes, Markdown headings, JSON shape, npm metadata, and
  GitHub Actions examples as release-facing interfaces.
- Keep release work atomic: changelog, roadmap, version, docs, and CI changes
  should be separate when they represent separate intents.
- Publishing is a maintainer-only action.

## Release Cycle Tasks

Agents may perform release-cycle maintenance as atomic commits.

Allowed release-cycle commits:

- `docs(changelog): add unreleased section`
- `chore(version): start next development cycle`
- `docs(roadmap): update next milestone`
- `docs(release): update release process`
- `ci(release): add release smoke check`

Rules:

- Do not create release-cycle commits unless there is a real release or
  milestone transition.
- Do not bump versions randomly.
- Do not tag or publish releases without explicit approval.
- Do not modify npm publishing settings without approval.
- Keep changelog, roadmap, and version changes separate when they represent
  separate intents.

## Versioning

`branchbrief` uses npm package versions and GitHub releases.

While pre-1.0:

- Patch releases, such as `0.1.1`, are for bug fixes, user-facing docs
  corrections, and release hygiene.
- Minor releases, such as `0.2.0`, are for new CLI capabilities, output
  additions, or GitHub Actions improvements.
- `1.0.0` should wait until CLI flags, default behavior, and output formats are
  stable enough for public compatibility expectations.

## Pre-Release Checklist

Before a release branch is cut:

- Start from latest `main`.
- Confirm `CHANGELOG.md` has a section for the release.
- Confirm `ROADMAP.md` still matches the release milestone.
- Confirm default behavior still requires no API key, network access, GitHub
  token, or LLM.
- Confirm release notes include verification, risk, and rollback notes.
- Run `npm run release:check`.

Use the full checklist in `docs/release-checklist.md` for final sign-off.

## npm Package Checks

Run:

```bash
npm ci
npm run release:check
npm run pack:dry-run
```

Review the dry-run package contents. The package should include:

- `dist/`
- `README.md`
- `LICENSE`
- `package.json`

The package should not include local reports, temporary files, credentials, or
unreviewed generated artifacts.

## GitHub Release Checklist

After package checks pass and a maintainer has approved the release:

- Confirm the release commit is on `main`.
- Confirm the version tag points to the approved release commit.
- Create a GitHub release for the tag.
- Include release notes with summary, verification, risk, and rollback notes.
- Link to the npm package.

Agents must not create tags, push tags, publish packages, or create GitHub
releases without explicit human approval.

## Post-Release Development Cycle

After a release:

- Add the next `Unreleased` changelog section when there is a real next
  development cycle.
- Update roadmap milestone status only when scope or direction changes.
- Keep version bumps separate from roadmap and changelog maintenance when they
  are separate review intents.
- File follow-up issues for known release gaps instead of hiding them in release
  notes.

## What Agents May Do

Agents may:

- Update release docs.
- Add or maintain changelog sections.
- Add or maintain release check scripts.
- Run local release checks.
- Prepare release notes for human review.
- Open a PR for release-cycle maintenance.

## What Agents May Not Do

Agents must not without explicit approval:

- Publish to npm.
- Create or push git tags.
- Push release branches.
- Create GitHub releases.
- Change npm publishing settings.
- Change GitHub Action release permissions.
- Modify secrets, tokens, or environment variables.
- Rewrite shared history.
