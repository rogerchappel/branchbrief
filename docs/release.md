# Release Guide

This guide describes how to publish `branchbrief` to npm so users can run it with `npx branchbrief`.

Publishing is a maintainer-only operation. Do not publish from a feature branch.

## Release Model

`branchbrief` uses npm package versions and GitHub releases.

Recommended versioning while the project is pre-1.0:

- Patch, such as `0.1.1`, for bug fixes, docs corrections that affect package users, and release hygiene.
- Minor, such as `0.2.0`, for new CLI capabilities, output additions, or GitHub Actions improvements.
- Major `1.0.0` only when the CLI flags, default behavior, and output formats are stable enough for public compatibility expectations.

Treat these as public compatibility surfaces once released:

- CLI command names and flags
- process exit codes
- Markdown section headings
- JSON output shape
- npm package name and binary name
- GitHub Action examples and documented permissions

## Pre-Release Checklist

Start from latest `main`:

```bash
git checkout main
git pull --ff-only origin main
```

Install clean dependencies:

```bash
npm ci
```

Run the release check:

```bash
npm run release:check
```

Review the package contents:

```bash
npm run pack:dry-run
```

The dry-run script rebuilds the CLI before packing. This matters because the documentation site and CLI both use `dist/` as an output directory in different workflows.

Confirm the tarball includes the CLI build and package metadata:

```text
dist/cli.js
dist/index.js
dist/types.js
README.md
LICENSE
package.json
```

Run an audit and decide whether any finding blocks release:

```bash
npm audit --audit-level=moderate
```

## Versioning

Update the npm version only after deciding the release type:

```bash
npm version patch
npm version minor
npm version major
```

`npm version` creates a version commit and git tag. Review both before pushing.

## Publishing

Publish only after checks pass and the release commit is on `main`:

```bash
npm login
npm publish
```

The package declares public access in `publishConfig`, so this publishes the public `branchbrief` package.

Verify the published package:

```bash
npm view branchbrief name version bin license
npx branchbrief --help
```

## GitHub Release

After publishing:

1. Push the version tag.
2. Create a GitHub release for the tag.
3. Include release notes with summary, verification, risk, and rollback notes.
4. Link to the npm package.

## Rollback

If a bad version is published:

1. Deprecate the bad npm version with a clear message.
2. Publish a fixed patch version.
3. Update the GitHub release notes.

Avoid unpublishing except for secrets, malware, legal issues, or a maintainer-approved emergency.
