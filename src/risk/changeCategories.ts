import type { RiskSignal } from "./classifyRisk";
import {
  CHANGE_CATEGORY_REASONS,
  type ChangeCategory,
} from "./riskRules";

export interface ChangeCategoryResult {
  categories: ChangeCategory[];
  notes: string[];
  signals: RiskSignal[];
}

export function classifyChangeCategories(
  changedFiles: string[],
): ChangeCategoryResult {
  const categories = new Set<ChangeCategory>();
  const signals: RiskSignal[] = [];

  for (const path of changedFiles) {
    categories.add(categoryForPath(path));
  }

  for (const category of categories) {
    signals.push({
      id: `category.${category}`,
      level: "low",
      reason: CHANGE_CATEGORY_REASONS[category],
    });
  }

  const notes: string[] = Array.from(categories).map(
    (category) => CHANGE_CATEGORY_REASONS[category],
  );

  const mixedRiskCategories = Array.from(categories).filter((category) =>
    ["source", "dependencies", "ci", "config"].includes(category),
  );

  if (mixedRiskCategories.length >= 2) {
    signals.push({
      id: "branch.mixed_intent",
      level: "medium",
      reason: `Mixed branch intent detected across ${mixedRiskCategories.join(", ")}`,
    });
    notes.push(
      `Mixed branch intent detected across ${mixedRiskCategories.join(", ")}`,
    );
  }

  return {
    categories: Array.from(categories),
    notes,
    signals,
  };
}

export function categoryForPath(path: string): ChangeCategory {
  const normalizedPath = path.replaceAll("\\", "/").toLowerCase();
  const basename = normalizedPath.split("/").at(-1) ?? normalizedPath;

  if (
    [
      "package.json",
      "package-lock.json",
      "pnpm-lock.yaml",
      "yarn.lock",
      "bun.lockb",
    ].includes(basename)
  ) {
    return "dependencies";
  }

  if (normalizedPath.startsWith(".github/workflows/")) {
    return "ci";
  }

  if (
    normalizedPath.includes("config") ||
    basename === "wrangler.toml" ||
    basename === "vercel.json" ||
    basename.startsWith("next.config") ||
    basename.startsWith("astro.config") ||
    basename.startsWith("tsconfig")
  ) {
    return "config";
  }

  if (
    normalizedPath.startsWith("docs/") ||
    basename === "readme.md" ||
    basename === "contributing.md" ||
    basename === "roadmap.md" ||
    basename === "changelog.md"
  ) {
    return "docs";
  }

  if (
    normalizedPath.startsWith("tests/") ||
    basename.includes(".test.") ||
    basename.includes(".spec.")
  ) {
    return "tests";
  }

  if (normalizedPath.startsWith("examples/")) {
    return "examples";
  }

  if (
    normalizedPath.startsWith("dist/") ||
    normalizedPath.startsWith("build/") ||
    normalizedPath.endsWith(".min.js")
  ) {
    return "generated";
  }

  return "source";
}
