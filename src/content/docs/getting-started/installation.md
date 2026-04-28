---
title: Installation
description: Install or run branchbrief as a local CLI.
---

`branchbrief` is planned as a Node.js CLI package.

## Requirements

- Node.js 22 or newer.
- A local git repository.
- A base branch available locally, such as `main` or `origin/main`.

## Run With npx

```bash
npx branchbrief --help
```

## Project Install

```bash
npm install --save-dev branchbrief
npx branchbrief --base main
```

The CLI should work without a GitHub token, API key, or LLM provider in its default mode.
