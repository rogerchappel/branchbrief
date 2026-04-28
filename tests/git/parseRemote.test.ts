import assert from "node:assert/strict";
import test from "node:test";

import { detectRepoName, parseRemoteRepoName } from "../../src/git/parseRemote.ts";

test("parseRemoteRepoName extracts names from common remote URL formats", () => {
  assert.equal(parseRemoteRepoName("git@github.com:rogerchappel/branchbrief.git"), "branchbrief");
  assert.equal(parseRemoteRepoName("https://github.com/rogerchappel/branchbrief.git"), "branchbrief");
  assert.equal(parseRemoteRepoName("ssh://git@github.com/rogerchappel/branchbrief.git"), "branchbrief");
  assert.equal(parseRemoteRepoName("https://github.com/rogerchappel/branchbrief"), "branchbrief");
});

test("detectRepoName falls back to the repo root basename", () => {
  assert.equal(detectRepoName("/Users/roger/code/branchbrief"), "branchbrief");
});
