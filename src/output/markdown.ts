import { renderCopilotReviewContext } from "./copilot.ts";
import type { BranchBriefInput } from "../types.ts";

export function renderMarkdownBranchBrief(input: BranchBriefInput): string {
  const lines = [
    "# Branch Brief",
    "",
    "## Overview",
    "",
    `Repo: ${input.repo.name}`,
    `Branch: ${input.branch.current}`,
    `Base: ${input.branch.base}`,
    `Generated: ${input.options?.generatedAt ?? "Not provided"}`,
    `Status: ${formatStatus(input.status)}`,
    "",
    "## Summary",
    "",
    `This branch contains ${input.commits.length} ${plural(input.commits.length, "commit")} affecting ${input.filesChanged.length} ${plural(input.filesChanged.length, "file")}.`,
    "",
    "## Commits",
    "",
    ...formatList(
      input.commits.map((commit) => `${commit.sha} ${commit.subject}`),
      "No commits found.",
    ),
    "",
    "## Files Changed",
    "",
    ...formatList(input.filesChanged, "No files changed."),
    "",
    "## Diff Stat",
    "",
    input.diffStat.raw ||
      `${input.diffStat.files} ${plural(input.diffStat.files, "file")} changed, ${input.diffStat.insertions} ${plural(input.diffStat.insertions, "insertion")}(+), ${input.diffStat.deletions} ${plural(input.diffStat.deletions, "deletion")}(-)`,
    "",
    "## Risk Level",
    "",
    input.risk.level,
    "",
    "## Risk Notes",
    "",
    ...formatList(input.risk.notes, "No risk notes reported."),
    "",
    "## Verification",
    "",
    input.verification.provided ? "Provided." : "Not provided.",
    "",
    "Suggested commands:",
    "",
    ...formatList(
      input.verification.suggestedCommands,
      "No suggested commands.",
    ),
    "",
    "## Rollback Plan",
    "",
    "Revert the branch or revert the listed commits.",
    "",
    "## Human Decision Needed",
    "",
    "Review the changed files, risk notes, and verification status before merge.",
  ];

  if (input.options?.copilot) {
    lines.push("", "## Copilot Review Context", "", renderCopilotReviewContext(input));
  }

  return `${lines.join("\n")}\n`;
}

function formatStatus(status: BranchBriefInput["status"]): string {
  return [
    status.dirty ? "dirty" : "clean",
    `staged ${status.stagedChanges}`,
    `unstaged ${status.unstagedChanges}`,
    `untracked ${status.untrackedFiles}`,
  ].join(", ");
}

function formatList(items: string[], emptyText: string): string[] {
  return items.length > 0 ? items.map((item) => `- ${item}`) : [emptyText];
}

function plural(count: number, singular: string): string {
  return count === 1 ? singular : `${singular}s`;
}
