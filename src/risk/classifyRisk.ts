import {
  classifyChangeCategories,
  type ChangeCategoryResult,
} from "./changeCategories";
import {
  classifyDiffSizeRisk,
  type DiffSizeRiskResult,
  type DiffStatInput,
} from "./diffSizeRisk";
import {
  classifyPathRisk,
  highestRisk,
  type PathRiskResult,
} from "./pathRisk";

export type RiskLevel = "low" | "medium" | "high";

export interface RiskSignal {
  id: string;
  level: RiskLevel;
  path?: string;
  reason: string;
}

export interface RiskResult {
  level: RiskLevel;
  notes: string[];
  signals: RiskSignal[];
}

export interface RiskInput {
  changedFiles: string[];
  diffStat?: DiffStatInput;
}

export function classifyRisk(input: RiskInput): RiskResult {
  const pathRisk = classifyPathRisk(input.changedFiles);
  const diffSizeRisk = classifyDiffSizeRisk(input.diffStat);
  const changeCategories = classifyChangeCategories(input.changedFiles);

  return mergeRiskResults(pathRisk, diffSizeRisk, changeCategories);
}

function mergeRiskResults(
  pathRisk: PathRiskResult,
  diffSizeRisk: DiffSizeRiskResult,
  changeCategories: ChangeCategoryResult,
): RiskResult {
  const signals = [
    ...pathRisk.signals,
    ...diffSizeRisk.signals,
    ...changeCategories.signals,
  ];
  const notes = unique([
    ...pathRisk.notes,
    ...diffSizeRisk.notes,
    ...changeCategories.notes,
  ]);

  return {
    level: highestRisk(signals.map((signal) => signal.level)),
    notes,
    signals,
  };
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}
