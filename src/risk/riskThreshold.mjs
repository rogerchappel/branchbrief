const RISK_ORDER = {
  low: 1,
  medium: 2,
  high: 3,
};

export function shouldFailRisk(level, threshold) {
  return riskRank(level, "level") >= riskRank(threshold, "threshold");
}

export function riskRank(level, label = "risk level") {
  if (!Object.hasOwn(RISK_ORDER, level)) {
    throw new TypeError(
      `Invalid ${label}: expected low, medium, or high; received ${String(level)}`,
    );
  }

  return RISK_ORDER[level];
}

