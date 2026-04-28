import assert from "node:assert/strict";
import test from "node:test";

import { parseDiffStat } from "../../src/git/getDiffStat.ts";

test("parseDiffStat parses plural shortstat output", () => {
  assert.deepEqual(
    parseDiffStat(" 3 files changed, 120 insertions(+), 8 deletions(-)"),
    {
      files: 3,
      insertions: 120,
      deletions: 8,
      raw: "3 files changed, 120 insertions(+), 8 deletions(-)",
    },
  );
});

test("parseDiffStat handles singular and missing counts", () => {
  assert.deepEqual(parseDiffStat(" 1 file changed, 1 insertion(+)"), {
    files: 1,
    insertions: 1,
    deletions: 0,
    raw: "1 file changed, 1 insertion(+)",
  });
});

test("parseDiffStat returns zero counts for an empty diff", () => {
  assert.deepEqual(parseDiffStat(""), {
    files: 0,
    insertions: 0,
    deletions: 0,
    raw: "",
  });
});
