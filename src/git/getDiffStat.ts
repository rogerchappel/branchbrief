import type { GitRunner } from "./runGit";

export interface DiffStat {
  files: number;
  insertions: number;
  deletions: number;
  raw: string;
}

const parseCount = (raw: string, pattern: RegExp): number => {
  const match = raw.match(pattern);
  return match ? Number.parseInt(match[1], 10) : 0;
};

export const parseDiffStat = (raw: string): DiffStat => {
  const trimmed = raw.trim();

  return {
    files: parseCount(trimmed, /(\d+) files? changed/),
    insertions: parseCount(trimmed, /(\d+) insertions?\(\+\)/),
    deletions: parseCount(trimmed, /(\d+) deletions?\(-\)/),
    raw: trimmed,
  };
};

export const getDiffStat = async (
  mergeBase: string,
  runGit: GitRunner,
  cwd?: string,
): Promise<DiffStat> => {
  const raw = await runGit(["diff", "--shortstat", `${mergeBase}..HEAD`], {
    cwd,
  });

  return parseDiffStat(raw);
};
