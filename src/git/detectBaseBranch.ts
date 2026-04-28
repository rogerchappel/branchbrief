import { GitCommandError } from "./runGit";
import type { GitRunner } from "./runGit";

export class BaseBranchNotFoundError extends Error {
  readonly candidates: string[];

  constructor(candidates: string[]) {
    super(`Unable to detect base branch. Tried: ${candidates.join(", ")}`);
    this.name = "BaseBranchNotFoundError";
    this.candidates = candidates;
  }
}

export interface DetectBaseBranchOptions {
  explicitBase?: string;
  cwd?: string;
  env?: Record<string, string | undefined>;
  runGit: GitRunner;
}

const unique = (values: Array<string | undefined>): string[] => {
  return [...new Set(values.filter((value): value is string => Boolean(value)))];
};

const refExists = async (
  ref: string,
  cwd: string | undefined,
  runGit: GitRunner,
): Promise<boolean> => {
  try {
    await runGit(["rev-parse", "--verify", "--quiet", `${ref}^{commit}`], { cwd });
    return true;
  } catch (error) {
    if (error instanceof GitCommandError) {
      return false;
    }

    throw error;
  }
};

export const detectBaseBranch = async ({
  explicitBase,
  cwd,
  env,
  runGit,
}: DetectBaseBranchOptions): Promise<string> => {
  const effectiveEnv =
    env ??
    (globalThis as unknown as { process?: { env?: Record<string, string | undefined> } })
      .process?.env ??
    {};
  const githubBase = effectiveEnv.GITHUB_BASE_REF;
  const candidates = unique([
    explicitBase,
    githubBase && `origin/${githubBase}`,
    githubBase,
    "origin/main",
    "main",
    "origin/master",
    "master",
  ]);

  for (const candidate of candidates) {
    if (await refExists(candidate, cwd, runGit)) {
      return candidate;
    }
  }

  throw new BaseBranchNotFoundError(candidates);
};
