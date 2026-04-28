import type { BranchBriefInput, CopilotReviewContext } from "./types.ts";

export function createCopilotReviewContext(
  input: BranchBriefInput,
): CopilotReviewContext {
  const sensitiveSignals = input.risk.signals.map((signal) => {
    const path = signal.path ? `${signal.path}: ` : "";
    return `${signal.level} - ${path}${signal.reason}`;
  });

  return {
    focus: [
      `Risk level: ${input.risk.level}`,
      "Sensitive files changed",
      "Public API changes",
      "Config or CI changes",
      "Missing tests",
      "Verification gaps",
      "Rollback concerns",
    ],
    riskSignals:
      sensitiveSignals.length > 0 ? sensitiveSignals : ["No risk signals reported."],
    verificationGaps: input.verification.provided
      ? ["Verification was provided for this branch."]
      : [
          "Verification was not provided.",
          ...input.verification.suggestedCommands.map(
            (command) => `Suggested command: ${command}`,
          ),
        ],
    rollbackConcerns: [
      "Confirm the listed commits can be reverted cleanly if issues are found.",
    ],
  };
}

export function renderCopilotReviewContext(input: BranchBriefInput): string {
  const context = createCopilotReviewContext(input);

  return [
    "Review this branch with attention to:",
    "",
    ...context.focus.map((item) => `- ${item}`),
    "",
    "Risk signals:",
    "",
    ...context.riskSignals.map((item) => `- ${item}`),
    "",
    "Verification gaps:",
    "",
    ...context.verificationGaps.map((item) => `- ${item}`),
    "",
    "Rollback concerns:",
    "",
    ...context.rollbackConcerns.map((item) => `- ${item}`),
  ].join("\n");
}
