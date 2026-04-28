import type { BranchBriefOptions } from "../types.js";

export const DEFAULT_BRANCH_BRIEF_OPTIONS: BranchBriefOptions = {
  format: "markdown",
  includeRisk: true,
  includeCopilotContext: false,
  color: true,
  quiet: false,
};

export function withDefaultOptions(
  options: Partial<BranchBriefOptions> = {},
): BranchBriefOptions {
  return {
    ...DEFAULT_BRANCH_BRIEF_OPTIONS,
    ...options,
  };
}
