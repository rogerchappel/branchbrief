---
title: Local-first by default
description: branchbrief defaults to local deterministic facts.
---

Default usage must require:

- No API key.
- No network access.
- No LLM.
- No GitHub token.
- No hidden credential use.

Facts should come from deterministic sources first:

- Local git metadata.
- Local repository files.
- Explicit CLI flags.
- GitHub Actions environment variables when running in Actions.

Optional integrations must not change the default trust model.
