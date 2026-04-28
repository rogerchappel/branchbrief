import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { withDefaultOptions } from "./config/defaults.js";
import { integrationNotWiredError } from "./errors/BranchBriefError.js";
import type {
  BranchBriefAdapters,
  BranchBriefOptions,
  BranchBriefResult,
} from "./types.js";

export type {
  BranchBriefAdapters,
  BranchBriefInput,
  BranchBriefOptions,
  BranchBriefResult,
  BranchFacts,
  OutputFormat,
  RiskLevel,
  RiskResult,
  RiskSignal,
  VerificationSuggestions,
} from "./types.js";

export {
  BranchBriefError,
  integrationNotWiredError,
} from "./errors/BranchBriefError.js";
export {
  DEFAULT_BRANCH_BRIEF_OPTIONS,
  withDefaultOptions,
} from "./config/defaults.js";

export async function generateBranchBrief(
  options: Partial<BranchBriefOptions> = {},
  adapters: BranchBriefAdapters = {},
): Promise<BranchBriefResult> {
  const resolvedOptions = withDefaultOptions(options);
  const missing = missingAdapters(resolvedOptions, adapters);

  if (missing.length > 0) {
    throw integrationNotWiredError(missing);
  }

  const facts = await adapters.collectBranchFacts!({
    base: resolvedOptions.base,
    cwd: resolvedOptions.repoRoot,
  });
  const risk = resolvedOptions.includeRisk
    ? await adapters.classifyRisk!({
        changedFiles: facts.filesChanged,
        diffStat: facts.diffStat,
      })
    : undefined;
  const verification = adapters.suggestVerification
    ? await adapters.suggestVerification(facts.repo.root)
    : undefined;
  const content = await adapters.renderBranchBrief!({
    facts,
    risk,
    verification,
    options: resolvedOptions,
  });

  if (resolvedOptions.output) {
    await writeFile(resolve(resolvedOptions.output), content, "utf8");
  }

  return {
    content,
    format: resolvedOptions.format,
    ...(resolvedOptions.output ? { output: resolvedOptions.output } : {}),
    ...(risk ? { risk } : {}),
  };
}

function missingAdapters(
  options: BranchBriefOptions,
  adapters: BranchBriefAdapters,
): string[] {
  const missing: string[] = [];

  if (!adapters.collectBranchFacts) {
    missing.push("git facts collection");
  }

  if (options.includeRisk && !adapters.classifyRisk) {
    missing.push("risk classification");
  }

  if (!adapters.suggestVerification) {
    missing.push("verification suggestions");
  }

  if (!adapters.renderBranchBrief) {
    missing.push("output rendering");
  }

  return missing;
}
