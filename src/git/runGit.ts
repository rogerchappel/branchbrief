import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export class GitCommandError extends Error {
  readonly args: string[];
  readonly stderr: string;

  constructor(args: string[], stderr: string) {
    super(`git ${args.join(" ")} failed${stderr ? `: ${stderr}` : ""}`);
    this.name = "GitCommandError";
    this.args = args;
    this.stderr = stderr;
  }
}

export interface GitRunnerOptions {
  cwd?: string;
}

export type GitRunner = (
  args: string[],
  options?: GitRunnerOptions,
) => Promise<string>;

export const runGit: GitRunner = async (args, options = {}) => {
  try {
    const { stdout } = await execFileAsync("git", args, {
      cwd: options.cwd,
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    });

    return stdout.trimEnd();
  } catch (error) {
    const maybeError = error as { stderr?: string };
    throw new GitCommandError(args, (maybeError.stderr ?? "").trim());
  }
};
