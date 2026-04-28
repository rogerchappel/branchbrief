import type { GitRunner } from "./runGit";

export interface WorkingTreeStatus {
  dirty: boolean;
  stagedChanges: number;
  unstagedChanges: number;
  untrackedFiles: number;
}

export const parseStatus = (raw: string): WorkingTreeStatus => {
  const lines = raw.split("\n").filter(Boolean);
  let stagedChanges = 0;
  let unstagedChanges = 0;
  let untrackedFiles = 0;

  for (const line of lines) {
    const x = line[0];
    const y = line[1];

    if (x === "?" && y === "?") {
      untrackedFiles += 1;
      continue;
    }

    if (x && x !== " ") {
      stagedChanges += 1;
    }

    if (y && y !== " ") {
      unstagedChanges += 1;
    }
  }

  return {
    dirty: stagedChanges > 0 || unstagedChanges > 0 || untrackedFiles > 0,
    stagedChanges,
    unstagedChanges,
    untrackedFiles,
  };
};

export const getStatus = async (
  runGit: GitRunner,
  cwd?: string,
): Promise<WorkingTreeStatus> => {
  const raw = await runGit(["status", "--short"], { cwd });
  return parseStatus(raw);
};
