import { createCopilotReviewContext } from "./copilot.ts";
import type { BranchBriefInput, BranchBriefJson } from "../types.ts";

export function toBranchBriefJson(input: BranchBriefInput): BranchBriefJson {
  const output: BranchBriefJson = {
    repo: input.repo,
    branch: input.branch,
    status: input.status,
    commits: input.commits,
    filesChanged: input.filesChanged,
    diffStat: input.diffStat,
    risk: input.risk,
    verification: input.verification,
  };

  if (input.options?.generatedAt) {
    output.generatedAt = input.options.generatedAt;
  }

  if (input.options?.copilot) {
    output.copilotReviewContext = createCopilotReviewContext(input);
  }

  return output;
}

export function renderJsonBranchBrief(input: BranchBriefInput): string {
  return `${JSON.stringify(toBranchBriefJson(input), null, 2)}\n`;
}
