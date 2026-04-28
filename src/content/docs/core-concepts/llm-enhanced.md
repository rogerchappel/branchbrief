---
title: LLM-enhanced by choice
description: Optional AI behavior must be explicit and disclosed.
---

LLM use is planned as an explicit opt-in enhancement.

The default command must not call OpenAI, Anthropic, OpenRouter, Copilot, Ollama, or any other model provider.

When LLM mode is introduced, it should require explicit flags such as:

```bash
branchbrief --llm --provider openai
```

LLM output should improve narrative fields only. Deterministic facts such as commits, changed files, diff stats, and risk signals remain the source of truth.
