#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

node "$repo_root/dist/cli.js" \
  --repo-root "$repo_root" \
  --base HEAD~1 \
  --output "$tmp/BRANCH_BRIEF.md" \
  --copilot \
  --no-color

node "$repo_root/dist/cli.js" \
  --repo-root "$repo_root" \
  --base HEAD~1 \
  --json \
  --output "$tmp/branch-brief.json" \
  --no-color

grep -q "Branch Brief" "$tmp/BRANCH_BRIEF.md"
grep -q "Copilot Review Context" "$tmp/BRANCH_BRIEF.md"
grep -q '"risk"' "$tmp/branch-brief.json"

echo "Demo output:"
echo "  $tmp/BRANCH_BRIEF.md"
echo "  $tmp/branch-brief.json"

