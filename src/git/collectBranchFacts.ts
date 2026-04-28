import type { BranchFacts } from "../types";
import { detectBaseBranch } from "./detectBaseBranch";
import { getChangedFiles } from "./getChangedFiles";
import { getCommits } from "./getCommits";
import { getDiffStat } from "./getDiffStat";
import { getStatus } from "./getStatus";
import { detectRepoName } from "./parseRemote";
import { GitCommandError, runGit as defaultRunGit } from "./runGit";
import type { GitRunner } from "./runGit";

export interface CollectBranchFactsOptions {
  cwd?: string;
  base?: string;
  env?: Record<string, string | undefined>;
  runGit?: GitRunner;
}

const optionalGit = async (
  runGit: GitRunner,
  args: string[],
  cwd?: string,
): Promise<string | undefined> => {
  try {
    const value = await runGit(args, { cwd });
    return value || undefined;
  } catch (error) {
    if (error instanceof GitCommandError) {
      return undefined;
    }

    throw error;
  }
};

export const collectBranchFacts = async (
  options: CollectBranchFactsOptions = {},
): Promise<BranchFacts> => {
  const runGit = options.runGit ?? defaultRunGit;
  const root = await runGit(["rev-parse", "--show-toplevel"], {
    cwd: options.cwd,
  });
  const cwd = root;
  const remote = await optionalGit(runGit, ["remote", "get-url", "origin"], cwd);
  const currentBranch =
    (await optionalGit(runGit, ["branch", "--show-current"], cwd)) ?? "HEAD";
  const base = await detectBaseBranch({
    explicitBase: options.base,
    cwd,
    env: options.env,
    runGit,
  });
  const mergeBase = await runGit(["merge-base", base, "HEAD"], { cwd });

  const [status, commits, filesChanged, diffStat] = await Promise.all([
    getStatus(runGit, cwd),
    getCommits(mergeBase, runGit, cwd),
    getChangedFiles(mergeBase, runGit, cwd),
    getDiffStat(mergeBase, runGit, cwd),
  ]);

  return {
    repo: {
      name: detectRepoName(root, remote),
      root,
      ...(remote ? { remote } : {}),
    },
    branch: {
      current: currentBranch,
      base,
      mergeBase,
    },
    status,
    commits,
    filesChanged,
    diffStat,
  };
};
