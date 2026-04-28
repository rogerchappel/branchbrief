import type { GitRunner } from "./runGit";

export interface BranchCommit {
  sha: string;
  subject: string;
}

export const parseCommits = (raw: string): BranchCommit[] => {
  if (!raw.trim()) {
    return [];
  }

  return raw
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf("\t");

      if (separatorIndex === -1) {
        return { sha: line.trim(), subject: "" };
      }

      return {
        sha: line.slice(0, separatorIndex),
        subject: line.slice(separatorIndex + 1),
      };
    });
};

export const getCommits = async (
  mergeBase: string,
  runGit: GitRunner,
  cwd?: string,
): Promise<BranchCommit[]> => {
  const raw = await runGit(
    ["log", "--format=%H%x09%s", `${mergeBase}..HEAD`],
    { cwd },
  );

  return parseCommits(raw);
};
