import type { RiskLevel, RiskSignal } from "./classifyRisk";
import { DIFF_SIZE_THRESHOLDS } from "./riskRules";

export interface DiffStatInput {
  files?: number;
  insertions?: number;
  deletions?: number;
}

export interface DiffSizeRiskResult {
  level: RiskLevel;
  notes: string[];
  signals: RiskSignal[];
}

export function classifyDiffSizeRisk(
  diffStat: DiffStatInput | undefined,
): DiffSizeRiskResult {
  if (!diffStat) {
    return { level: "low", notes: [], signals: [] };
  }

  const files = diffStat.files ?? 0;
  const changedLines = (diffStat.insertions ?? 0) + (diffStat.deletions ?? 0);
  const signals: RiskSignal[] = [];
  const notes: string[] = [];

  if (files > DIFF_SIZE_THRESHOLDS.highFileCount) {
    signals.push({
      id: "diff_size.files.high",
      level: "high",
      reason: `${files} files changed, above high-risk threshold of ${DIFF_SIZE_THRESHOLDS.highFileCount}`,
    });
    notes.push(`Large diff: ${files} files changed`);
  } else if (files > DIFF_SIZE_THRESHOLDS.mediumFileCount) {
    signals.push({
      id: "diff_size.files.medium",
      level: "medium",
      reason: `${files} files changed, above medium-risk threshold of ${DIFF_SIZE_THRESHOLDS.mediumFileCount}`,
    });
    notes.push(`Medium-sized diff: ${files} files changed`);
  }

  if (changedLines > DIFF_SIZE_THRESHOLDS.highLineDelta) {
    signals.push({
      id: "diff_size.lines.high",
      level: "high",
      reason: `${changedLines} total insertions/deletions, above high-risk threshold of ${DIFF_SIZE_THRESHOLDS.highLineDelta}`,
    });
    notes.push(`Large diff: ${changedLines} total insertions/deletions`);
  } else if (changedLines > DIFF_SIZE_THRESHOLDS.mediumLineDelta) {
    signals.push({
      id: "diff_size.lines.medium",
      level: "medium",
      reason: `${changedLines} total insertions/deletions, above medium-risk threshold of ${DIFF_SIZE_THRESHOLDS.mediumLineDelta}`,
    });
    notes.push(`Medium-sized diff: ${changedLines} total insertions/deletions`);
  }

  return {
    level: highestRisk(signals.map((signal) => signal.level)),
    notes,
    signals,
  };
}

function highestRisk(levels: RiskLevel[]): RiskLevel {
  if (levels.includes("high")) {
    return "high";
  }

  if (levels.includes("medium")) {
    return "medium";
  }

  return "low";
}
