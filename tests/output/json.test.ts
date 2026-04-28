import { strict as assert } from "node:assert";
import test from "node:test";
import {
  renderJsonBranchBrief,
  toBranchBriefJson,
} from "../../src/output/json.ts";
import { sampleBranchBriefInput } from "./fixtures.ts";

test("renders stable json without renderer options", () => {
  const json = toBranchBriefJson(sampleBranchBriefInput);

  assert.deepEqual(json, {
    repo: sampleBranchBriefInput.repo,
    branch: sampleBranchBriefInput.branch,
    status: sampleBranchBriefInput.status,
    commits: sampleBranchBriefInput.commits,
    filesChanged: sampleBranchBriefInput.filesChanged,
    diffStat: sampleBranchBriefInput.diffStat,
    risk: sampleBranchBriefInput.risk,
    verification: sampleBranchBriefInput.verification,
    generatedAt: "2026-04-28T00:00:00.000Z",
  });
});

test("renders parseable pretty json with a trailing newline", () => {
  const rendered = renderJsonBranchBrief(sampleBranchBriefInput);

  assert.equal(rendered.endsWith("\n"), true);
  assert.deepEqual(JSON.parse(rendered), toBranchBriefJson(sampleBranchBriefInput));
});
