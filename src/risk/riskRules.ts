import type { RiskLevel } from "./classifyRisk";

export const RISK_LEVELS: RiskLevel[] = ["low", "medium", "high"];

export const HIGH_RISK_PATH_SIGNALS = [
  "auth",
  "security",
  "stripe",
  "billing",
  "payment",
  "payments",
  "migration",
  "migrations",
  "secret",
  "secrets",
  ".env",
  "production",
  "database",
  "schema",
  "terraform",
  "infra",
  "iam",
  "oauth",
  "session",
  "token",
  "credential",
  "webhook",
] as const;

export const MEDIUM_RISK_PATH_SIGNALS = [
  "package.json",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "bun.lockb",
  ".github/workflows",
  "config",
  "configs",
  "api",
  "sdk",
  "client",
  "server",
  "docker",
  "Dockerfile",
  "compose",
  "wrangler.toml",
  "vercel.json",
  "next.config",
  "astro.config",
  "tsconfig",
] as const;

export const LOW_RISK_PATH_SIGNALS = [
  "README.md",
  "docs/",
  "examples/",
  "tests/",
  ".test.",
  ".spec.",
  "CONTRIBUTING.md",
  "ROADMAP.md",
  "CHANGELOG.md",
] as const;

export const DIFF_SIZE_THRESHOLDS = {
  mediumFileCount: 20,
  highFileCount: 50,
  mediumLineDelta: 1_000,
  highLineDelta: 5_000,
} as const;

export const CHANGE_CATEGORY_REASONS = {
  source: "source code changed",
  dependencies: "dependency manifest or lockfile changed",
  ci: "CI workflow changed",
  config: "configuration changed",
  docs: "documentation changed",
  tests: "test files changed",
  examples: "example files changed",
  generated: "generated or build artifact changed",
} as const;

export type ChangeCategory = keyof typeof CHANGE_CATEGORY_REASONS;
