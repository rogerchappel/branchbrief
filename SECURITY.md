# Security Policy

## Supported Versions

`branchbrief` is pre-1.0 software. Security fixes are expected to target the latest released version.

## Reporting a Vulnerability

Do not open a public issue for a suspected vulnerability.

Use GitHub private vulnerability reporting for this repository if it is enabled. If private reporting is not enabled, contact the maintainer through the repository owner profile and include:

- affected version or commit
- reproduction steps
- expected impact
- whether credentials, tokens, production data, or network access are involved
- any safe workaround you know

## Security Expectations

Default `branchbrief` behavior should not require:

- API keys
- GitHub tokens
- network access
- LLM or model-provider calls
- hidden credential use
- telemetry

Changes that introduce optional integrations must make those effects explicit in command names, flags, permissions, and documentation.
