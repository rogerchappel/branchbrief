---
title: LLM policy
description: Required safeguards for optional LLM-enhanced branch briefs.
---

LLM mode must be explicit.

Default behavior must not call OpenAI, Anthropic, OpenRouter, Copilot, Ollama, or any other local or remote model provider.

## Provider Selection

Future LLM commands should require explicit provider selection:

```bash
branchbrief --llm --provider openai
branchbrief --llm --provider anthropic
branchbrief --llm --provider openrouter
branchbrief --llm --provider ollama
```

## Data Modes

| Mode | Intended contents |
| --- | --- |
| `metadata` | Repo, branch, commit messages, file paths, diff stats, risk signals, suggested verification. |
| `patch` | Selected diff hunks. Requires a warning. |
| `full` | Full diff. Requires a stronger warning. |

The default LLM data mode should be `metadata`.

## API Key Disclosure

Before an LLM call, branchbrief should disclose:

- Provider.
- Model.
- Credential source.
- Data mode.
- Whether network access is used.

It must never print secret values.

## Privacy Warnings

Patch and full modes may send source code or sensitive data to the selected provider. They should require a clear warning and an explicit confirmation or non-interactive acknowledgement.
