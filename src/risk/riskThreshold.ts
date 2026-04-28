import type { RiskLevel } from "../types.ts";

const RISK_ORDER: Record<RiskLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

export function shouldFailRisk(level: RiskLevel, threshold: RiskLevel): boolean {
  return riskRank(level, "level") >= riskRank(threshold, "threshold");
}

export function riskRank(level: RiskLevel, label = "risk level"): number {
  if (!Object.hasOwn(RISK_ORDER, level)) {
    throw new TypeError(
      `Invalid ${label}: expected low, medium, or high; received ${String(level)}`,
    );
  }

  return RISK_ORDER[level];
}
