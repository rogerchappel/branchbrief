# npm Publishing

This guide prepares maintainers to publish `branchbrief` to npm. It is a release checklist, not an instruction to publish from a feature branch.

Do not add `NPM_TOKEN` to this repository. The publish workflow is designed for npm Trusted Publishing with GitHub OIDC.

## Package Metadata

Expected first-release metadata:

- package name: `branchbrief`
- version: `0.1.0`
- binary: `branchbrief`
- bin path: `./dist/cli.js`
- license: `MIT`
- package contents: `dist`, `README.md`, `LICENSE`, and npm's automatically included `package.json`

The package is local-first by default. Publishing must not introduce API keys, hidden credentials, network calls, model provider calls, telemetry, or GitHub write behavior.

## Maintainer Setup

Before the first Trusted Publishing release:

1. Create or claim the `branchbrief` package on npm if needed.
2. In the npm package settings, add a trusted publisher for this GitHub repository.
3. Configure the trusted publisher to use the `Publish to npm` workflow on the `main` branch.
4. Confirm two-factor authentication and maintainer access are correct for the npm package.
5. Confirm the GitHub release will be created only after the release commit is merged to `main`.

Trusted Publishing still requires npmjs.com setup. GitHub OIDC only works after npm trusts this repository and workflow.

## Manual Verification

Run these commands from a clean checkout of the release commit:

```bash
npm ci
npm test
npm run build
npm pack --dry-run
npm pack
npm install -g ./branchbrief-0.1.0.tgz
branchbrief --help
branchbrief --version
npm uninstall -g branchbrief
```

After `npm pack --dry-run`, verify the tarball contents include the built CLI and do not include source files, tests, docs source, secrets, local config, or generated documentation output.

Expected contents include:

```text
dist/cli.js
dist/index.js
dist/types.js
README.md
LICENSE
package.json
```

Also verify:

- `branchbrief --help` exits successfully.
- `branchbrief --version` prints `0.1.0`.
- `package.json` maps `bin.branchbrief` to `./dist/cli.js`.
- no `.env`, token, key, or credential file is included in the package.

## GitHub Release Flow

The publish workflow runs when a GitHub release is published.

Recommended maintainer flow:

1. Start from latest `main`.
2. Run the manual verification checklist.
3. Create and merge a focused release-prep pull request if metadata or docs changed.
4. Tag the release commit, for example `v0.1.0`.
5. Create GitHub release notes with summary, verification, risk, and rollback notes.
6. Publish the GitHub release.
7. Confirm the `Publish to npm` workflow completes successfully.
8. Verify the published package:

```bash
npm view branchbrief name version bin license
npx branchbrief --help
npx branchbrief --version
```

Do not publish from a feature branch. Do not run `npm publish` locally unless maintainers intentionally choose manual publishing instead of Trusted Publishing.

## Rollback

If a bad package is published:

1. Deprecate the affected npm version with a clear maintainer-approved message.
2. Publish a fixed patch version.
3. Update the GitHub release notes with the issue, impact, and replacement version.

Avoid unpublishing except for secrets, malware, legal issues, or maintainer-approved emergencies.
