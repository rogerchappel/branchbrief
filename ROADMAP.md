# Roadmap

This roadmap aligns release-cycle maintenance with the product direction in
`docs/PRD.md`. It is intentionally lightweight so release notes and milestone
planning stay easy to review.

## V1 - Local-First Branch Briefs

V1 focuses on a reliable local CLI that works without credentials, network
access, or model calls.

- Generate Markdown and JSON branch briefs from local git state.
- Detect branch, base branch, commits, changed files, and diff statistics.
- Classify risk with deterministic path and size rules.
- Suggest verification commands from local project signals.
- Write output to files for PR descriptions, handoff notes, and automation.
- Support read-only GitHub Actions usage with job summaries and artifacts.
- Provide Copilot-readable context without depending on Copilot.
- Ship docs, examples, tests, and npm publishing guidance.

## V2 - Optional Workflow Enhancements

V2 adds integrations while keeping local-first behavior as the default.

- Optional LLM summaries behind explicit flags and provider configuration.
- Safe data modes for provider-backed workflows.
- Optional OpenAI, Anthropic, OpenRouter, and Ollama support.
- GitHub PR comments, labels, and risk gates with explicit permissions.
- Config files for path rules, verification hints, and output preferences.
- `.github/copilot-instructions.md` generation.
- Agent workflow integration patterns.

## V3 - Review Intelligence Layer

V3 expands branchbrief into a richer review and policy layer for teams.

- Policy-as-code for release, review, and risk rules.
- Multi-agent review flows and branch handoff orchestration.
- Deeper semantic risk analysis with auditable source facts.
- Baseline comparison across PRs and release cycles.
- Static reports or dashboards for maintainers.
- Custom plugin rules.
- Deep monorepo and workspace support.
- Enterprise privacy controls.

## Release Alignment

- Keep changelog entries grouped by release version.
- Update this roadmap only when milestone direction changes.
- Keep roadmap, changelog, and version changes in separate commits when they
  represent separate review intents.
- Do not mark roadmap items as shipped until implementation, docs, and
  verification have landed.
