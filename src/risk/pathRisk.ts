import type { RiskLevel, RiskSignal } from "./classifyRisk";
import {
  HIGH_RISK_PATH_SIGNALS,
  LOW_RISK_PATH_SIGNALS,
  MEDIUM_RISK_PATH_SIGNALS,
} from "./riskRules";

export interface PathRiskResult {
  level: RiskLevel;
  notes: string[];
  signals: RiskSignal[];
}

export function classifyPathRisk(changedFiles: string[]): PathRiskResult {
  const signals: RiskSignal[] = [];
  const notes = new Set<string>();

  for (const path of changedFiles) {
    const highSignal = findPathSignal(path, HIGH_RISK_PATH_SIGNALS);
    if (highSignal) {
      signals.push({
        id: "path.high",
        level: "high",
        path,
        reason: `High-risk path signal "${highSignal}" matched`,
      });
      notes.add(`High-risk path changed: ${path}`);
      continue;
    }

    const mediumSignal = findPathSignal(path, MEDIUM_RISK_PATH_SIGNALS);
    if (mediumSignal) {
      signals.push({
        id: "path.medium",
        level: "medium",
        path,
        reason: `Medium-risk path signal "${mediumSignal}" matched`,
      });
      notes.add(`Medium-risk path changed: ${path}`);
    }
  }

  if (changedFiles.length > 0 && changedFiles.every(isLowRiskPath)) {
    signals.push({
      id: "path.low_only",
      level: "low",
      reason: "Only low-risk documentation, test, or example paths changed",
    });
    notes.add("Only low-risk documentation, test, or example paths changed");
  }

  return {
    level: highestRisk(signals.map((signal) => signal.level)),
    notes: Array.from(notes),
    signals,
  };
}

export function isLowRiskPath(path: string): boolean {
  return Boolean(findPathSignal(path, LOW_RISK_PATH_SIGNALS));
}

export function findPathSignal(
  path: string,
  signals: readonly string[],
): string | undefined {
  const normalizedPath = normalizePath(path);

  return signals.find((signal) => {
    const normalizedSignal = normalizePath(signal);

    if (normalizedSignal.endsWith("/")) {
      return normalizedPath.startsWith(normalizedSignal);
    }

    return normalizedPath.includes(normalizedSignal);
  });
}

export function highestRisk(levels: RiskLevel[]): RiskLevel {
  if (levels.includes("high")) {
    return "high";
  }

  if (levels.includes("medium")) {
    return "medium";
  }

  return "low";
}

function normalizePath(path: string): string {
  return path.replaceAll("\\", "/").toLowerCase();
}
