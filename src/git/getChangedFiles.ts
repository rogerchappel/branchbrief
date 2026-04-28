import type { GitRunner } from "./runGit";

export const parseChangedFiles = (raw: string): string[] => {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
};

export const getChangedFiles = async (
  mergeBase: string,
  runGit: GitRunner,
  cwd?: string,
): Promise<string[]> => {
  const raw = await runGit(["diff", "--name-only", `${mergeBase}..HEAD`], {
    cwd,
  });

  return parseChangedFiles(raw);
};
