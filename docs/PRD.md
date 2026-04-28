# PRD: branchbrief

## Product Name

**branchbrief**

## Tagline

Turn any branch into a reviewable, auditable brief for humans and AI reviewers.

## One-Line Pitch

`branchbrief` is a local-first CLI and GitHub Action that converts branch state into a structured review brief: commits, changed files, diff stats, risk flags, verification gaps, rollback notes, and Copilot/agent-ready review context.

---

# 1. Executive Summary

Modern AI-assisted development creates more branches, more commits, more pull requests, and more review load.

Tools like Codex, OpenClaw, Claude Code, GitHub Copilot, and other coding agents can produce useful code quickly, but the human reviewer still needs to answer:

- What changed?
- Why did it change?
- How risky is it?
- What files were touched?
- Were tests run?
- Does this affect auth, payments, production data, config, migrations, or public APIs?
- What decision does a human need to make?
- Can this be merged, revised, split, or reverted?

`branchbrief` solves this by generating a consistent **branch review brief** from local git state or a GitHub pull request.

It is designed for:

- humans supervising AI agents
- maintainers reviewing multiple PRs
- production teams that care about audit trails
- OSS contributors who need clear handoff context
- agent workflows that need a deterministic review artifact

The core principle:

> Local-first by default. LLM-enhanced by choice. Copilot-compatible, not Copilot-dependent.

---

# 2. Product Principles

## 2.1 Local-First

Default usage must require:

- no API key
- no network access
- no LLM
- no GitHub token
- no hidden credential use

The default command:

```bash
branchbrief
```

must work using only local git metadata.

## 2.2 Deterministic Facts First

`branchbrief` should collect facts deterministically before any LLM involvement.

Facts include:

- repo name
- current branch
- base branch
- commits since base
- files changed
- diff stat
- uncommitted changes
- risky paths
- suggested verification commands

LLMs may later improve wording, but they must not be the source of truth.

## 2.3 Explicit AI Use

The tool must never silently call:

- OpenAI
- Anthropic
- OpenRouter
- Copilot
- Ollama
- any local or remote model provider

LLM use must be explicit:

```bash
branchbrief --llm --provider openai
```

## 2.4 Human Accountability

The output should help humans make better review decisions.

It should not claim code is safe merely because an agent generated it.

## 2.5 Auditability

Every branch brief should be suitable for:

- PR descriptions
- PR comments
- release notes
- review handoff
- compliance/audit records
- agent completion reports

## 2.6 Small, Useful, Extensible

V1 should be small and reliable.

V2 and V3 can add richer GitHub, Copilot, LLM, policy, and agent integration.

---

# 3. Target Users

## 3.1 Primary Users

### AI-Assisted Solo Developers

People using Codex, OpenClaw, Claude Code, Copilot, or other agents to generate code across many branches.

They need fast handoff summaries and risk signals.

### OSS Maintainers

Maintainers reviewing community or agent-generated PRs.

They need review context before reading the diff.

### Technical Founders

Founders managing multiple repos, production code, OSS tools, and AI agents.

They need throughput without losing control.

### Small Engineering Teams

Teams that want structured PR context and safer branch review rituals.

## 3.2 Secondary Users

- GitHub Copilot users
- GitHub Actions users
- devtools builders
- agent framework authors
- release managers
- compliance-conscious startups

---

# 4. Problem Statement

AI coding agents increase output but also increase review burden.

A branch may contain:

- many commits
- mixed docs/tests/code changes
- risky files
- hidden config changes
- package updates
- generated files
- incomplete verification
- unclear human decisions

Current PR descriptions are often manually written, inconsistent, or missing entirely.

Agent-generated summaries can be vague or overly confident.

Reviewers need a reliable, repeatable way to transform a branch into a reviewable handoff artifact.

---

# 5. Product Goals

## 5.1 V1 Goals

V1 should provide a useful local CLI that generates a branch brief from git state.

V1 must:

- work offline
- require no LLM
- support Markdown output
- support JSON output
- detect branch/base/commits/files/diff stats
- classify risk using path-based rules
- suggest verification commands
- support output to file
- work in GitHub Actions
- include Copilot-readable context
- ship with strong docs and examples

## 5.2 V2 Goals

V2 should add optional AI and GitHub workflow enhancements.

V2 should:

- support optional LLM summaries
- support safe data modes
- support OpenAI, Anthropic, OpenRouter, and Ollama
- support PR comments
- support GitHub labels
- support GitHub Action risk gates
- generate `.github/copilot-instructions.md`
- integrate with agent workflows
- support config files

## 5.3 V3 Goals

V3 should become a complete branch review intelligence layer.

V3 should:

- support policy-as-code
- support multi-agent review flows
- support deeper semantic risk analysis
- support baseline comparison across PRs
- support CrewCMD/OpenClaw orchestration
- support dashboards or static reports
- support custom plugin rules
- support monorepos and workspaces deeply
- support enterprise/privacy controls

---

# 6. Non-Goals

## V1 Non-Goals

V1 should not:

- become a hosted SaaS
- require login
- require GitHub
- require an LLM
- modify code
- auto-review patches semantically
- post PR comments by default
- request Copilot review automatically
- run tests automatically unless explicitly requested
- merge PRs
- make policy decisions for humans

## Product-Wide Non-Goals

`branchbrief` is not:

- a replacement for code review
- a replacement for CI
- a replacement for static analysis
- an AI code reviewer
- a security scanner
- a PR merge bot

It is a structured review context generator.

---

# 7. Core Concepts

## 7.1 Branch Brief

A **branch brief** is a Markdown or JSON artifact describing what changed on a branch.

It includes:

- repo
- branch
- base
- status
- commits
- changed files
- diff stat
- risk level
- risk notes
- suggested verification
- rollback notes
- human decision required
- Copilot/AI reviewer context

## 7.2 Risk Level

Risk level is a simple classification:

- `low`
- `medium`
- `high`

Risk is based on changed paths, file types, diff size, and known sensitive areas.

## 7.3 Data Mode

For LLM usage, data mode controls what gets sent.

Supported modes:

- `metadata`
- `patch`
- `full`

Default LLM data mode must be `metadata`.

## 7.4 Review Context

Review context is the part of the brief written for humans and AI reviewers.

It highlights:

- what to inspect
- what decisions are needed
- what risk signals exist
- what verification is missing

---

# 8. V1 Scope

## 8.1 V1 CLI

### Primary Command

```bash
branchbrief
```

Generates a Markdown branch brief to stdout.

### Options

```bash
branchbrief --base main
branchbrief --output BRANCH_BRIEF.md
branchbrief --json
branchbrief --risk
branchbrief --copilot
branchbrief --fail-on high
branchbrief --fail-on medium
branchbrief --version
branchbrief --help
```

### Optional V1 Options

```bash
branchbrief --repo-root .
branchbrief --no-color
branchbrief --quiet
```

---

## 8.2 V1 Git Facts Collection

The CLI must collect:

- repo root
- repo name
- current branch
- base branch
- merge base
- commits since base
- changed files since base
- diff stat since base
- uncommitted changes
- staged changes
- whether working tree is dirty

Suggested git commands:

```bash
git rev-parse --show-toplevel
git branch --show-current
git remote get-url origin
git merge-base <base> HEAD
git log --oneline <base>..HEAD
git diff --name-only <base>...HEAD
git diff --stat <base>...HEAD
git status --short
```

Implementation should avoid shell injection by using safe process execution APIs with argument arrays.

---

## 8.3 V1 Base Branch Detection

Base branch detection order:

1. Explicit `--base`
2. GitHub Actions base ref if present
3. local `origin/main`
4. local `main`
5. local `origin/master`
6. local `master`
7. fail with clear error

In GitHub Actions, detect:

```text
GITHUB_BASE_REF
GITHUB_HEAD_REF
GITHUB_REF_NAME
GITHUB_REPOSITORY
```

---

## 8.4 V1 Markdown Output

Default Markdown output:

```md
# Branch Brief

## Overview

Repo:
Branch:
Base:
Generated:
Status:

## Summary

This branch contains <N> commits affecting <N> files.

## Commits

- <commit>
- <commit>
- <commit>

## Files Changed

- <file>
- <file>
- <file>

## Diff Stat

<diff stat>

## Risk Level

<low|medium|high>

## Risk Notes

- <reason>
- <reason>

## Verification

Not provided.

Suggested commands:

- <command>
- <command>

## Rollback Plan

Revert the branch or revert the listed commits.

## Human Decision Needed

Review the changed files, risk notes, and verification status before merge.

## Copilot Review Context

Review this branch with attention to:

- Risk level
- Sensitive files changed
- Public API changes
- Config or CI changes
- Missing tests
- Verification gaps
- Rollback concerns
```

---

## 8.5 V1 JSON Output

Command:

```bash
branchbrief --json
```

Example schema:

```json
{
  "repo": {
    "name": "branchbrief",
    "root": "/path/to/repo",
    "remote": "git@github.com:rogerchappel/branchbrief.git"
  },
  "branch": {
    "current": "agent/add-risk-classification",
    "base": "main",
    "mergeBase": "abc123"
  },
  "status": {
    "dirty": false,
    "stagedChanges": 0,
    "unstagedChanges": 0,
    "untrackedFiles": 0
  },
  "commits": [
    {
      "sha": "abc123",
      "subject": "feat(risk): classify sensitive path changes"
    }
  ],
  "filesChanged": [
    "src/risk/classifyRisk.ts",
    "tests/risk.test.ts"
  ],
  "diffStat": {
    "files": 2,
    "insertions": 120,
    "deletions": 8,
    "raw": "2 files changed, 120 insertions(+), 8 deletions(-)"
  },
  "risk": {
    "level": "medium",
    "notes": [
      "Source files changed",
      "Tests added"
    ],
    "signals": [
      {
        "level": "medium",
        "path": "src/risk/classifyRisk.ts",
        "reason": "source code changed"
      }
    ]
  },
  "verification": {
    "provided": false,
    "suggestedCommands": [
      "npm test",
      "npm run typecheck"
    ]
  }
}
```

---

## 8.6 V1 Risk Detection

### High-Risk Path Signals

Classify as high risk if changed paths contain:

```text
auth
security
stripe
billing
payment
payments
migration
migrations
secret
secrets
.env
production
database
schema
terraform
infra
iam
oauth
session
token
credential
webhook
```

### Medium-Risk Path Signals

Classify as medium risk if changed paths include:

```text
package.json
package-lock.json
pnpm-lock.yaml
yarn.lock
bun.lockb
.github/workflows
config
configs
public api
api
sdk
client
server
docker
Dockerfile
compose
wrangler.toml
vercel.json
next.config
astro.config
tsconfig
```

### Low-Risk Path Signals

Classify as low risk if changes are mostly:

```text
README.md
docs/
examples/
tests/
*.test.*
*.spec.*
CONTRIBUTING.md
ROADMAP.md
CHANGELOG.md
```

### Diff Size Escalation

Escalate risk based on size:

- over 20 files changed: medium
- over 50 files changed: high
- over 1,000 insertions/deletions: medium
- over 5,000 insertions/deletions: high

### Mixed Intent Detection

Flag if branch changes multiple categories:

- source + dependencies + CI
- migrations + source
- auth + payments
- docs + runtime + config

This does not automatically fail, but should add a risk note.

---

## 8.7 V1 Verification Suggestions

`branchbrief` should inspect common project files and suggest commands.

### package.json

If scripts exist:

```json
{
  "scripts": {
    "test": "...",
    "typecheck": "...",
    "lint": "...",
    "build": "..."
  }
}
```

Suggest:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Use the detected package manager where possible:

- `pnpm`
- `npm`
- `yarn`
- `bun`

### Makefile

Suggest relevant targets:

```bash
make test
make lint
make build
```

### justfile

Suggest:

```bash
just test
just lint
just build
```

### Python

Detect:

- `pyproject.toml`
- `requirements.txt`
- `pytest.ini`

Suggest:

```bash
pytest
ruff check .
mypy .
```

Only suggest commands. Do not run them in V1 unless explicitly added later.

---

## 8.8 V1 GitHub Actions Support

`branchbrief` must support running inside GitHub Actions.

### Default Action Example

The default documented workflow should require read-only permissions.

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

### Risk Gate Example

```yaml
      - name: Generate branch brief with risk gate
        run: |
          npx branchbrief --base "${{ github.base_ref }}" --output BRANCH_BRIEF.md --fail-on high
```

If risk is high and `--fail-on high` is used, exit non-zero.

---

## 8.9 V1 Copilot-Compatible Output

`branchbrief` should support:

```bash
branchbrief --copilot
```

This adds:

```md
## Copilot Review Context

Review this branch with attention to:

- Risk level: <risk>
- Sensitive files changed: <yes/no>
- Public API changed: <yes/no/unknown>
- Tests changed: <yes/no>
- CI/config changed: <yes/no>
- Verification provided: <yes/no>
- Human decision needed: <text>

Suggested review focus:

1. <focus area>
2. <focus area>
3. <focus area>
```

V1 must not request a Copilot review automatically.

---

## 8.10 V1 Repository Requirements

The repo must include:

```text
README.md
LICENSE
AGENTS.md
CONTRIBUTING.md
SECURITY.md
ROADMAP.md
docs/PRD.md
examples/
src/
tests/
.github/workflows/ci.yml
.github/workflows/branchbrief.yml
```

---

# 9. V2 Scope

V2 adds optional AI, GitHub workflow improvements, config files, and deeper agent integration.

## 9.1 Optional LLM Mode

LLM mode must be explicit.

```bash
branchbrief --llm --provider openai
branchbrief --llm --provider anthropic
branchbrief --llm --provider openrouter
branchbrief --llm --provider ollama
```

Default must remain no LLM.

### Required Disclosure

Before making any LLM call, print:

```text
LLM mode enabled.
Provider: <provider>
Model: <model>
Credential source: <ENV_KEY or local/no auth>
Data mode: <metadata|patch|full>
Network: <yes|no>
```

### Credential Sources

Supported providers:

```text
OpenAI:     OPENAI_API_KEY
Anthropic:  ANTHROPIC_API_KEY
OpenRouter: OPENROUTER_API_KEY
Ollama:     no key by default
```

Rules:

- never print secret values
- never scan arbitrary env vars
- never require API keys in default mode
- missing key must produce a clear error
- `.env` files are not loaded unless explicitly requested

Optional:

```bash
branchbrief --env-file .env.local
```

---

## 9.2 LLM Data Modes

### Metadata Mode

Default LLM mode.

```bash
branchbrief --llm --data metadata
```

May send:

- repo name
- branch name
- base branch
- commit messages
- changed file paths
- diff stats
- risk signals
- suggested verification commands

Must not send:

- patch contents
- full source code
- secrets
- `.env` contents

### Patch Mode

```bash
branchbrief --llm --data patch
```

May send selected diff hunks.

Requires warning.

### Full Mode

```bash
branchbrief --llm --data full
```

May send full diff.

Requires strong warning.

### Warning

For patch/full:

```text
This may send source code or sensitive data to the selected LLM provider.

Provider: <provider>
Model: <model>
Data mode: <patch|full>
Files included: <N>
Risk flags: <flags>

Continue? [y/N]
```

Non-interactive bypass:

```bash
branchbrief --llm --data full --yes
```

`--yes` bypasses prompts but must not hide disclosure.

---

## 9.3 LLM Output Contract

LLM should return narrative fields only.

Input facts are deterministic.

Example output:

```json
{
  "summary": "Adds a CLI command for generating review briefs from branch state.",
  "riskNotes": "Medium risk because public CLI behavior changes.",
  "humanDecisionNeeded": "Confirm command naming and output format before merge.",
  "reviewFocus": [
    "CLI behavior",
    "error handling",
    "test coverage"
  ]
}
```

The LLM must not override deterministic facts like changed files or commit count.

---

## 9.4 Config File Support

Support:

```text
.branchbrief.json
.branchbrief.yaml
branchbrief.config.js
```

Recommended first config:

```yaml
base: main
output: BRANCH_BRIEF.md
copilot: true
risk:
  failOn: high
  high:
    - auth
    - stripe
    - migrations
    - .env
  medium:
    - package.json
    - .github/workflows
verification:
  suggest: true
llm:
  enabled: false
  provider: openai
  model: gpt-4.1-mini
  data: metadata
```

Config precedence:

1. CLI flags
2. config file
3. environment variables
4. defaults

---

## 9.5 PR Comment Support

Support:

```bash
branchbrief github comment --file BRANCH_BRIEF.md
```

Or:

```bash
branchbrief --github-comment
```

This requires GitHub token access.

In GitHub Actions, use:

```text
GITHUB_TOKEN
```

Rules:

- PR comments must be opt-in
- write permissions must be documented
- default Action must remain read-only
- comment should be idempotent if possible
- update existing branchbrief comment rather than spamming

---

## 9.6 GitHub Label Support

Support:

```bash
branchbrief github label
branchbrief github label --risk
```

Possible labels:

```text
risk:low
risk:medium
risk:high
needs:verification
needs:human-review
agent-generated
```

Labeling must be opt-in.

---

## 9.7 Copilot Init Command

Support:

```bash
branchbrief init copilot
```

Creates:

```text
.github/copilot-instructions.md
```

Suggested content:

```md
# GitHub Copilot Instructions

This repository uses branch briefs for review handoff.

When reviewing or modifying code:

- keep PRs focused and reviewable
- preserve atomic commits
- respect AGENTS.md and repository instructions
- call out risky files explicitly
- suggest relevant verification
- do not approve production, payment, auth, migration, or secret-related changes without human review

When opening or updating a PR, include:

- summary
- verification
- risk level
- rollback notes
- human decision needed
```

Do not overwrite existing file unless:

```bash
branchbrief init copilot --force
```

---

## 9.8 Agent Init Command

Support:

```bash
branchbrief init agents
```

Creates or updates:

```text
AGENTS.md
```

Or appends a branchbrief section.

Suggested section:

```md
## Branch Briefs

At the end of every branch task, run:

```bash
branchbrief --output BRANCH_BRIEF.md --copilot
```

Include the generated brief in the PR description or final review pack.

Do not claim completion without verification status.
```

---

## 9.9 GitHub Action Wrapper

Consider publishing a GitHub Action:

```yaml
- uses: rogerchappel/branchbrief-action@v1
  with:
    base: ${{ github.base_ref }}
    output: BRANCH_BRIEF.md
    copilot: true
    fail-on: high
```

This can be V2 or V3 depending on build speed.

---

# 10. V3 Scope

V3 turns branchbrief into a broader review intelligence layer.

## 10.1 Policy-as-Code

Support a policy file:

```yaml
policies:
  - name: no-production-data-without-review
    match:
      paths:
        - "**/production/**"
        - "**/migrations/**"
    require:
      labels:
        - human-reviewed
    risk: high
    fail: true

  - name: docs-only-low-risk
    match:
      paths:
        - "docs/**"
        - "*.md"
    risk: low
```

Commands:

```bash
branchbrief policy check
branchbrief --policy .branchbrief.policy.yaml
```

---

## 10.2 Advanced Risk Analysis

Add deeper heuristics:

- deleted files
- renamed files
- dependency major version changes
- migration detection
- secret-like strings
- generated file detection
- public API export changes
- package boundary changes
- test coverage gaps
- snapshot churn
- lockfile-only changes
- CI permission changes

---

## 10.3 Semantic LLM Review

Optional semantic review mode:

```bash
branchbrief --llm-review --data patch
```

This should ask the LLM to produce:

- likely behavior changes
- possible regressions
- missing tests
- review questions
- risky assumptions

It should not be called by default.

---

## 10.4 CrewCMD / OpenClaw Integration

Support machine-readable output for orchestration.

```bash
branchbrief --json --for crewcmd
branchbrief --json --for openclaw
```

Output should include:

- review status
- risk level
- next recommended action
- human decision required
- suggested follow-up tasks

Potential CrewCMD flow:

```text
Agent completes branch
→ branchbrief generates JSON
→ CrewCMD collects branch briefs
→ CrewCMD creates review dashboard
→ human approves/rejects/escalates
```

---

## 10.5 Multi-Branch Dashboard

Generate a static dashboard across branches:

```bash
branchbrief dashboard
branchbrief dashboard --repo .
branchbrief dashboard --org rogerchappel
```

Output:

- branches
- risk levels
- commits
- changed files
- stale branches
- review status
- verification status

Could generate:

```text
branchbrief-report.html
branchbrief-report.md
branchbrief-report.json
```

---

## 10.6 Review Memory

Optional local memory:

```text
.branchbrief/history/
```

Stores:

- generated briefs
- risk history
- reviewer decisions
- merge outcomes

Useful for:

- seeing whether risk predictions were useful
- building future release notes
- evaluating agents

---

## 10.7 Plugin System

Allow custom risk rules:

```ts
export default {
  rules: [
    {
      name: "stripe-risk",
      matchPath: /stripe|billing|payment/,
      level: "high",
      note: "Payment-related file changed"
    }
  ]
}
```

Plugins should be local and explicit.

---

# 11. Technical Architecture

## 11.1 Recommended Stack

- TypeScript
- Node.js
- `commander` or `cac` for CLI
- `execa` or safe `child_process` wrapper for git
- `zod` for config/schema validation
- `picocolors` for CLI output
- `vitest` for tests
- `tsup` for builds
- GitHub Actions for CI

## 11.2 Proposed File Structure

```text
src/
  cli.ts
  index.ts

  git/
    collectBranchFacts.ts
    detectBaseBranch.ts
    getCommits.ts
    getChangedFiles.ts
    getDiffStat.ts
    getStatus.ts
    parseRemote.ts

  risk/
    classifyRisk.ts
    riskRules.ts
    diffSizeRisk.ts
    pathRisk.ts

  verification/
    suggestCommands.ts
    detectPackageManager.ts
    detectProjectType.ts

  output/
    markdown.ts
    json.ts
    copilot.ts

  github/
    detectActionsEnv.ts
    commentOnPr.ts
    labels.ts

  llm/
    summarize.ts
    prompt.ts
    providers/
      openai.ts
      anthropic.ts
      openrouter.ts
      ollama.ts

  config/
    loadConfig.ts
    schema.ts
    defaults.ts

  init/
    initCopilot.ts
    initAgents.ts
    initGithubAction.ts

tests/
  git/
  risk/
  output/
  verification/
  fixtures/
```

---

# 12. CLI Design

## 12.1 Main Commands

```bash
branchbrief
branchbrief generate
branchbrief init copilot
branchbrief init agents
branchbrief init github-action
branchbrief github comment
branchbrief github label
branchbrief policy check
```

For V1, `branchbrief` and `branchbrief generate` can be equivalent.

## 12.2 CLI Examples

### Basic

```bash
branchbrief
```

### Save to File

```bash
branchbrief --output BRANCH_BRIEF.md
```

### JSON

```bash
branchbrief --json
```

### Copilot Context

```bash
branchbrief --copilot
```

### Risk Gate

```bash
branchbrief --fail-on high
```

### GitHub Action

```bash
branchbrief --base "$GITHUB_BASE_REF" --output BRANCH_BRIEF.md --copilot
```

### LLM Metadata Summary

```bash
branchbrief --llm --provider openai --data metadata
```

### LLM Full Diff Summary

```bash
branchbrief --llm --provider openai --data full --yes
```

---

# 13. Agent Work Plan

This repo should be built by several agents working in parallel after the scaffold lands.

## Agent 1: Repo Scaffold Agent

### Objective

Create the initial TypeScript CLI repo structure.

### Tasks

- initialize package
- configure TypeScript
- configure tsup
- configure vitest
- add CLI entry
- add README skeleton
- add LICENSE
- add AGENTS.md
- add CONTRIBUTING.md
- add SECURITY.md

### Suggested commits

```text
chore(repo): scaffold branchbrief package
chore(tooling): configure typescript build and tests
docs(readme): add initial project overview
docs(agents): add repository agent instructions
```

### Acceptance

- `npm install` works
- `npm run build` works
- `npm test` works
- `branchbrief --help` works

---

## Agent 2: Git Facts Agent

### Objective

Implement local git fact collection.

### Tasks

- detect repo root
- detect repo name
- detect current branch
- detect base branch
- collect commits
- collect changed files
- collect diff stat
- collect working tree status

### Suggested commits

```text
feat(git): collect branch metadata
feat(git): list commits and changed files
feat(git): include diff stat and working tree status
test(git): cover branch fact collection
```

### Acceptance

- works in a real git repo
- handles missing base branch clearly
- tests cover parsing logic

---

## Agent 3: Risk Agent

### Objective

Implement path and diff-size risk classification.

### Tasks

- add risk rules
- classify high/medium/low
- generate risk notes
- add diff-size escalation
- add mixed intent notes

### Suggested commits

```text
feat(risk): classify sensitive path changes
feat(risk): escalate large diffs
feat(risk): flag mixed change categories
test(risk): cover path and size classification
```

### Acceptance

- high-risk paths detected
- medium-risk paths detected
- docs/tests paths handled as low risk
- tests cover edge cases

---

## Agent 4: Output Agent

### Objective

Implement Markdown, JSON, and Copilot context output.

### Tasks

- generate Markdown brief
- generate JSON brief
- add `--output`
- add `--json`
- add `--copilot`

### Suggested commits

```text
feat(output): generate markdown branch briefs
feat(output): support json output
feat(output): add copilot review context
test(output): cover markdown and json rendering
```

### Acceptance

- Markdown renders cleanly
- JSON schema is stable
- Copilot section appears only when requested

---

## Agent 5: Verification Suggestions Agent

### Objective

Suggest relevant verification commands.

### Tasks

- detect package manager
- read package scripts
- detect Makefile
- detect justfile
- detect Python project files
- add suggested commands to brief

### Suggested commits

```text
feat(verification): suggest package script commands
feat(verification): detect make and just tasks
feat(verification): suggest python verification commands
test(verification): cover command suggestions
```

### Acceptance

- suggests useful commands
- does not claim they were run
- handles missing files gracefully

---

## Agent 6: GitHub Actions Agent

### Objective

Make branchbrief easy to use in GitHub Actions.

### Tasks

- document workflow
- add example workflow
- support Actions env detection
- write Action summary example
- implement `--fail-on`

### Suggested commits

```text
feat(ci): support risk gate exit codes
docs(github): add actions workflow examples
ci: add branchbrief self-check workflow
test(ci): cover fail-on risk thresholds
```

### Acceptance

- workflow example works
- `--fail-on high` exits non-zero on high risk
- docs distinguish read-only and write workflows

---

## Agent 7: Copilot Integration Agent

### Objective

Add Copilot-compatible setup and docs.

### Tasks

- implement `branchbrief init copilot`
- generate `.github/copilot-instructions.md`
- add Copilot usage docs
- add PR review context examples

### Suggested commits

```text
feat(init): generate copilot instructions
docs(copilot): document copilot review workflow
test(init): cover copilot instruction generation
```

### Acceptance

- does not overwrite existing file without `--force`
- generated instructions are useful
- README shows Copilot-compatible workflow

---

## Agent 8: LLM Agent

### Objective

Add optional LLM summaries safely.

### Tasks

- add provider interface
- add metadata-only prompt
- add OpenAI provider
- add Anthropic provider
- add Ollama provider
- add data mode warnings
- add missing key errors

### Suggested commits

```text
feat(llm): add optional metadata summary mode
feat(llm): add provider configuration and disclosure
feat(llm): support openai and anthropic providers
feat(llm): support local ollama summaries
test(llm): cover data mode safeguards
```

### Acceptance

- default mode does not call LLM
- `--llm` required
- disclosure printed
- metadata mode does not send patches
- missing keys produce clear errors

---

## Agent 9: Documentation Agent

### Objective

Make the repo easy for humans and agents to understand.

### Tasks

- write README
- write docs/PRD.md
- write examples
- write ROADMAP.md
- write CONTRIBUTING.md
- add sample output
- add screenshots/asciinema later if useful

### Suggested commits

```text
docs(readme): document branchbrief usage
docs(examples): add sample branch brief output
docs(roadmap): outline v1 to v3 plan
docs(contributing): explain agent-friendly workflow
```

### Acceptance

- README explains the product in under 30 seconds
- examples are copy-pasteable
- roadmap matches this PRD

---

# 14. V1 Milestones

## Milestone 0: Repo Ready

- repo scaffolded
- CLI help works
- CI works
- docs skeleton present

## Milestone 1: Local Brief

- git facts collected
- Markdown generated
- output file supported

## Milestone 2: Risk Brief

- risk classification
- risk notes
- diff stat
- verification suggestions

## Milestone 3: Automation Ready

- JSON output
- GitHub Actions example
- fail-on risk threshold
- Copilot context output

## Milestone 4: Public V1

- README complete
- examples complete
- tests passing
- npm package ready
- GitHub release/tag created

---

# 15. Acceptance Criteria

## V1 Acceptance

- [ ] `branchbrief --help` works
- [ ] `branchbrief` works in a git repo
- [ ] `branchbrief --base main` works
- [ ] `branchbrief --output BRANCH_BRIEF.md` writes a file
- [ ] `branchbrief --json` outputs JSON
- [ ] `branchbrief --copilot` adds Copilot review context
- [ ] `branchbrief --fail-on high` exits non-zero for high-risk branches
- [ ] risk detection identifies sensitive paths
- [ ] verification suggestions work for Node projects
- [ ] GitHub Actions example works
- [ ] CI runs tests/build
- [ ] README is clear
- [ ] docs/PRD.md exists
- [ ] no LLM/API key required

## V2 Acceptance

- [ ] `--llm` is explicit
- [ ] provider disclosure is printed
- [ ] metadata mode sends no patch content
- [ ] patch/full modes warn
- [ ] OpenAI provider works
- [ ] Anthropic provider works
- [ ] Ollama provider works
- [ ] config file supported
- [ ] PR comment support works
- [ ] Copilot instructions init works

## V3 Acceptance

- [ ] policy-as-code supported
- [ ] plugin rules supported
- [ ] dashboard/report generation works
- [ ] CrewCMD/OpenClaw JSON mode works
- [ ] advanced risk rules implemented
- [ ] semantic LLM review optional and safe

---

# 16. Security and Privacy Requirements

## 16.1 Default Safety

Default mode must not:

- call network
- read secrets
- load `.env`
- send code anywhere
- write outside requested output path
- mutate repo state

## 16.2 Secret Handling

The tool must:

- never print secret values
- never include `.env` contents
- flag `.env` file changes as high risk
- warn before sending patches to LLM
- support redaction before LLM modes

## 16.3 GitHub Token Handling

For GitHub comments/labels:

- require explicit command
- use `GITHUB_TOKEN` or `GH_TOKEN`
- never print token
- document minimal permissions

## 16.4 LLM Handling

LLM mode:

- opt-in only
- disclose provider/model/env key/data mode
- metadata mode by default
- patch/full require warning
- no hidden credential discovery

---

# 17. README Positioning

README opening:

```md
# branchbrief

Turn any branch into a reviewable, auditable brief for humans and AI reviewers.

`branchbrief` is a local-first CLI and GitHub Action for developers working with AI agents, Copilot, Codex, OpenClaw, Claude Code, or high-throughput branch workflows.

It summarizes commits, changed files, diff stats, risk signals, verification gaps, and human decisions needed before merge.

Local-first by default. LLM-enhanced by choice.
```

---

# 18. Example Output

```md
# Branch Brief

## Overview

Repo: crewcmd
Branch: agent/add-review-pack-command
Base: main
Generated: 2026-04-28T12:15:00Z
Status: needs review

## Summary

This branch contains 5 commits affecting 12 files.

## Commits

- feat(cli): add review pack command
- test(cli): cover review pack output
- docs(readme): document review workflow
- docs(agents): add review pack policy
- ci: run CLI smoke test

## Files Changed

- src/commands/review-pack.ts
- src/cli.ts
- tests/review-pack.test.ts
- README.md
- AGENTS.md
- .github/workflows/ci.yml

## Diff Stat

12 files changed, 482 insertions(+), 91 deletions(-)

## Risk Level

Medium

## Risk Notes

- Public CLI behavior changed
- CI workflow changed
- Tests were added
- No auth, payment, migration, secret, or production data files detected

## Verification

Suggested commands:

- npm test
- npm run typecheck
- npm run lint
- npm run build

## Rollback Plan

Revert the listed commits or close the branch without merging.

## Human Decision Needed

Confirm the new CLI command name, output format, and whether this should be treated as stable public behavior.

## Copilot Review Context

Review this branch with attention to:

- CLI behavior and naming
- Error handling
- Test coverage
- Backwards compatibility
- CI workflow changes
```

---

# 19. Suggested Initial Commits

```text
chore(repo): scaffold branchbrief package
chore(tooling): configure typescript build and tests
feat(git): collect branch metadata
feat(git): list commits and changed files
feat(risk): classify sensitive path changes
feat(output): generate markdown branch briefs
feat(output): support json output
feat(output): add copilot review context
feat(verification): suggest package script commands
feat(ci): support risk gate exit codes
docs(readme): document branchbrief usage
docs(examples): add sample branch brief output
docs(roadmap): outline v1 to v3 plan
ci: add build and test workflow
```

---

# 20. Contributor Guidance

Contributors should:

- keep PRs focused
- use atomic commits
- add tests for parsing/risk/output changes
- avoid adding network calls to default mode
- preserve local-first behavior
- document any new provider or integration
- treat privacy and explicit consent as product features

---

# 21. Agent Instructions

Agents working on this repo must:

1. Read `AGENTS.md`
2. Work on a branch
3. Use atomic commits
4. Keep PRs reviewable
5. Avoid broad rewrites
6. Run relevant verification
7. Generate a branch brief before final handoff
8. Return a review pack

Required agent handoff:

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

---

# 22. Product Roadmap Summary

## V1: Local Branch Briefs

- local CLI
- git facts
- Markdown/JSON output
- risk detection
- verification suggestions
- GitHub Actions summary
- Copilot-readable context

## V2: Workflow Integrations

- optional LLM summaries
- safe data modes
- config file
- PR comments
- labels
- Copilot instructions generator
- AGENTS.md generator

## V3: Review Intelligence Layer

- policy-as-code
- advanced risk analysis
- plugin rules
- dashboard
- CrewCMD/OpenClaw integration
- semantic optional AI review
- branch history and outcome tracking

---

# 23. Final Product Promise

`branchbrief` helps humans stay in control when agents move fast.

It does not replace review.

It makes review possible at higher throughput.
