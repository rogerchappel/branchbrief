import assert from "node:assert/strict";
import { test } from "node:test";

import { riskRank, shouldFailRisk } from "../../src/risk/riskThreshold.mjs";

test("riskRank orders low before medium before high", () => {
  assert.equal(riskRank("low"), 1);
  assert.equal(riskRank("medium"), 2);
  assert.equal(riskRank("high"), 3);
});

test("shouldFailRisk fails at or above the threshold", () => {
  assert.equal(shouldFailRisk("low", "medium"), false);
  assert.equal(shouldFailRisk("medium", "medium"), true);
  assert.equal(shouldFailRisk("high", "medium"), true);
  assert.equal(shouldFailRisk("medium", "high"), false);
  assert.equal(shouldFailRisk("high", "high"), true);
});

test("shouldFailRisk rejects unknown levels", () => {
  assert.throws(() => shouldFailRisk("critical", "high"), /Invalid level/);
  assert.throws(() => shouldFailRisk("high", "critical"), /Invalid threshold/);
});

