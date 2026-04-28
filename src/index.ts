import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { withDefaultOptions } from "./config/defaults.js";
import { BranchBriefError } from "./errors/BranchBriefError.js";
import { BaseBranchNotFoundError } from "./git/detectBaseBranch.ts";
import { collectBranchFacts } from "./git/collectBranchFacts.ts";
import { GitCommandError } from "./git/runGit.ts";
import { renderJsonBranchBrief } from "./output/json.ts";
import { renderMarkdownBranchBrief } from "./output/markdown.ts";
import { classifyRisk } from "./risk/classifyRisk.ts";
import { shouldFailRisk } from "./risk/riskThreshold.ts";
import { suggestVerificationCommands } from "./verification/suggestCommands.ts";
import type {
  BranchBriefAdapters,
  BranchBriefOptions,
  BranchBriefResult,
  RiskLevel,
} from "./types.js";

export type {
  BranchBriefAdapters,
  BranchBriefInput,
  BranchBriefOptions,
  BranchBriefResult,
  BranchFacts,
  OutputFormat,
  RiskLevel,
  RiskResult,
  RiskSignal,
  VerificationSuggestions,
} from "./types.js";

export {
  BranchBriefError,
} from "./errors/BranchBriefError.js";
export {
  DEFAULT_BRANCH_BRIEF_OPTIONS,
  withDefaultOptions,
} from "./config/defaults.js";

export async function generateBranchBrief(
  options: Partial<BranchBriefOptions> = {},
  adapters: BranchBriefAdapters = {},
): Promise<BranchBriefResult> {
  const resolvedOptions = withDefaultOptions(options);
  const resolvedAdapters = {
    collectBranchFacts,
    classifyRisk,
    suggestVerification: suggestVerificationCommands,
    renderBranchBrief:
      resolvedOptions.format === "json"
        ? renderJsonBranchBrief
        : renderMarkdownBranchBrief,
    ...adapters,
  };

  try {
    const facts = await resolvedAdapters.collectBranchFacts({
      base: resolvedOptions.base,
      cwd: resolvedOptions.repoRoot,
    });
    const risk = resolvedOptions.includeRisk
      ? await resolvedAdapters.classifyRisk({
        changedFiles: facts.filesChanged,
        diffStat: facts.diffStat,
      })
      : { level: "low" as RiskLevel, notes: [], signals: [] };
    const verification = await resolvedAdapters.suggestVerification(facts.repo.root);
    const content = await resolvedAdapters.renderBranchBrief({
      repo: facts.repo,
      branch: facts.branch,
      status: facts.status,
      commits: facts.commits,
      filesChanged: facts.filesChanged,
      diffStat: facts.diffStat,
      risk,
      verification,
      options: {
        copilot: resolvedOptions.includeCopilotContext,
        generatedAt: new Date().toISOString(),
      },
    });

    if (resolvedOptions.output) {
      await writeFile(resolve(resolvedOptions.output), content, "utf8");
    }

    const failedRiskGate =
      resolvedOptions.failOn && shouldFailRisk(risk.level, resolvedOptions.failOn);

    return {
      content,
      format: resolvedOptions.format,
      ...(resolvedOptions.output ? { output: resolvedOptions.output } : {}),
      risk,
      ...(failedRiskGate && resolvedOptions.failOn
        ? {
            failedRiskGate: {
              threshold: resolvedOptions.failOn,
              level: risk.level,
              message: `Risk gate failed: branch risk is ${risk.level}, which meets or exceeds --fail-on ${resolvedOptions.failOn}.`,
            },
          }
        : {}),
    };
  } catch (error) {
    throw toBranchBriefError(error);
  }
}

function toBranchBriefError(error: unknown): BranchBriefError {
  if (error instanceof BranchBriefError) {
    return error;
  }

  if (error instanceof BaseBranchNotFoundError) {
    return new BranchBriefError({
      code: "BASE_BRANCH_NOT_FOUND",
      exitCode: 2,
      message: "Base branch could not be found.",
      details: [
        `Tried: ${error.candidates.join(", ")}`,
        "Fetch the base branch or pass an existing ref with --base <branch>.",
      ],
    });
  }

  if (error instanceof GitCommandError) {
    if (error.args.join(" ") === "rev-parse --show-toplevel") {
      return new BranchBriefError({
        code: "NOT_A_GIT_REPOSITORY",
        exitCode: 2,
        message: "Not inside a git repository.",
        details: ["Run branchbrief from a git repo or pass --repo-root <path>."],
      });
    }

    return new BranchBriefError({
      code: "GIT_COMMAND_FAILED",
      exitCode: 2,
      message: `Git command failed: git ${error.args.join(" ")}`,
      details: error.stderr ? [error.stderr] : [],
    });
  }

  if (error instanceof Error && "code" in error) {
    const code = String((error as { code?: unknown }).code);
    if (code === "EACCES" || code === "ENOENT" || code === "EISDIR") {
      return new BranchBriefError({
        code: "OUTPUT_WRITE_FAILED",
        exitCode: 2,
        message: "Output file could not be written.",
        details: [error.message],
      });
    }
  }

  return new BranchBriefError({
    code: "UNEXPECTED_ERROR",
    message: error instanceof Error ? error.message : String(error),
    exitCode: 1,
  });
}
