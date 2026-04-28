# Release Checklist

Use this checklist before publishing `branchbrief`. Publishing remains a
maintainer-only action.

## Release Readiness

- [ ] Release branch starts from latest `main`.
- [ ] Working tree is clean before release preparation begins.
- [ ] `package.json` version matches the intended release.
- [ ] `CHANGELOG.md` has release notes for the intended version.
- [ ] `ROADMAP.md` matches the milestone being released.
- [ ] README examples match implemented CLI behavior.
- [ ] GitHub Actions examples use safe permissions and `fetch-depth: 0`.

## Local-First Safety

- [ ] Default CLI behavior requires no API key.
- [ ] Default CLI behavior requires no network access.
- [ ] Default CLI behavior requires no LLM call.
- [ ] Default CLI behavior requires no GitHub token.
- [ ] Optional AI behavior is explicit in flags and docs.
- [ ] Optional GitHub write behavior is explicit in flags, permissions, and
  docs.

## Verification

- [ ] `npm ci`
- [ ] `npm test`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run build:docs`
- [ ] `git diff --check`
- [ ] `npm run pack:dry-run`
- [ ] `npm audit --audit-level=moderate` reviewed by a maintainer.

## npm Package Review

- [ ] Package dry run includes built CLI files under `dist/`.
- [ ] Package dry run includes `README.md`.
- [ ] Package dry run includes `LICENSE`.
- [ ] Package dry run includes `package.json`.
- [ ] Package dry run excludes local reports, temporary files, credentials, and
  unreviewed generated artifacts.
- [ ] `bin.branchbrief` points to the built CLI entrypoint.
- [ ] `engines.node` matches documented requirements.

## GitHub Release

- [ ] Release commit is on `main`.
- [ ] Version tag points to the approved release commit.
- [ ] GitHub release notes include summary, verification, risk, and rollback
  notes.
- [ ] GitHub release links to the npm package.
- [ ] No release is merged, tagged, pushed, or published without explicit human
  approval.

## Post-Release

- [ ] Published package verified with `npm view branchbrief name version bin
  license`.
- [ ] Published CLI verified with `npx branchbrief --help`.
- [ ] Next `Unreleased` changelog section added only when the next development
  cycle begins.
- [ ] Known follow-up work is captured as issues or roadmap updates.
