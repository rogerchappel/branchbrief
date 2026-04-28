import assert from "node:assert/strict";
import test from "node:test";

import { parseStatus } from "../../src/git/getStatus.ts";

test("parseStatus counts staged, unstaged, and untracked changes", () => {
  assert.deepEqual(
    parseStatus(["M  staged.ts", " M unstaged.ts", "MM both.ts", "?? new.ts"].join("\n")),
    {
      dirty: true,
      stagedChanges: 2,
      unstagedChanges: 2,
      untrackedFiles: 1,
    },
  );
});

test("parseStatus reports a clean working tree", () => {
  assert.deepEqual(parseStatus(""), {
    dirty: false,
    stagedChanges: 0,
    unstagedChanges: 0,
    untrackedFiles: 0,
  });
});
