import type { BranchBriefInput } from "../../src/output/types.ts";

export const sampleBranchBriefInput: BranchBriefInput = {
  repo: {
    name: "branchbrief",
    root: "/path/to/branchbrief",
    remote: "git@github.com:rogerchappel/branchbrief.git",
  },
  branch: {
    current: "agent/output-renderers",
    base: "main",
    mergeBase: "abc123",
  },
  status: {
    dirty: false,
    stagedChanges: 0,
    unstagedChanges: 0,
    untrackedFiles: 0,
  },
  commits: [
    {
      sha: "abc123",
      subject: "feat(output): generate markdown branch briefs",
    },
    {
      sha: "def456",
      subject: "feat(output): support json branch briefs",
    },
  ],
  filesChanged: [
    "src/output/markdown.ts",
    "src/output/json.ts",
    "tests/output/markdown.test.ts",
  ],
  diffStat: {
    files: 3,
    insertions: 180,
    deletions: 0,
    raw: "3 files changed, 180 insertions(+)",
  },
  risk: {
    level: "low",
    notes: ["Output-only changes", "No git or filesystem access"],
    signals: [
      {
        level: "low",
        path: "src/output/markdown.ts",
        reason: "pure renderer changed",
      },
    ],
  },
  verification: {
    provided: false,
    suggestedCommands: ["node --test tests/output/*.test.ts", "git diff --check"],
  },
  options: {
    generatedAt: "2026-04-28T00:00:00.000Z",
  },
};
