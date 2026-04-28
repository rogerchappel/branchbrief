#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { BranchBriefError } from "./errors/BranchBriefError.js";
import { generateBranchBrief } from "./index.js";
import type { BranchBriefOptions, RiskLevel } from "./types.js";

type CliCommand =
  | { kind: "generate"; options: BranchBriefOptions }
  | { kind: "help" }
  | { kind: "version" };

export interface CliIo {
  stdout: Writable;
  stderr: Writable;
}

interface Writable {
  write(chunk: string): unknown;
}

const VALID_FAIL_ON_LEVELS = new Set<RiskLevel>(["low", "medium", "high"]);

export function parseCliArgs(argv: string[]): CliCommand {
  const options: BranchBriefOptions = {
    format: "markdown",
    includeRisk: true,
    includeCopilotContext: false,
    color: true,
    quiet: false,
  };

  const args = [...argv];

  if (args[0] === "generate") {
    args.shift();
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    switch (arg) {
      case "--help":
      case "-h":
        return { kind: "help" };
      case "--version":
      case "-v":
        return { kind: "version" };
      case "--base":
        options.base = readValue(args, ++index, "--base");
        break;
      case "--output":
        options.output = readValue(args, ++index, "--output");
        break;
      case "--json":
        options.format = "json";
        break;
      case "--risk":
        options.includeRisk = true;
        break;
      case "--copilot":
        options.includeCopilotContext = true;
        break;
      case "--fail-on": {
        const level = readValue(args, ++index, "--fail-on");
        if (!VALID_FAIL_ON_LEVELS.has(level as RiskLevel)) {
          throw new BranchBriefError({
            code: "INVALID_ARGUMENT",
            message:
              "Invalid --fail-on value: expected low, medium, or high.",
            exitCode: 1,
            details: [`Received: ${level}`],
          });
        }
        options.failOn = level as RiskLevel;
        break;
      }
      case "--repo-root":
        options.repoRoot = readValue(args, ++index, "--repo-root");
        break;
      case "--no-color":
        options.color = false;
        break;
      case "--quiet":
        options.quiet = true;
        break;
      default:
        throw new BranchBriefError({
          code: "INVALID_ARGUMENT",
          message: `Unknown argument: ${arg}`,
          exitCode: 1,
        });
    }
  }

  return { kind: "generate", options };
}

export async function runCli(
  argv = process.argv.slice(2),
  io: CliIo = { stdout: process.stdout, stderr: process.stderr },
): Promise<number> {
  try {
    const command = parseCliArgs(argv);

    if (command.kind === "help") {
      io.stdout.write(`${helpText()}\n`);
      return 0;
    }

    if (command.kind === "version") {
      io.stdout.write(`${readPackageVersion()}\n`);
      return 0;
    }

    const result = await generateBranchBrief(command.options);

    if (!command.options.output && !command.options.quiet) {
      io.stdout.write(result.content);
      if (!result.content.endsWith("\n")) {
        io.stdout.write("\n");
      }
    }

    return 0;
  } catch (error) {
    const branchBriefError = toBranchBriefError(error);
    io.stderr.write(`branchbrief: ${branchBriefError.message}\n`);

    for (const detail of branchBriefError.details) {
      io.stderr.write(`  - ${detail}\n`);
    }

    return branchBriefError.exitCode;
  }
}

export function helpText(): string {
  return `branchbrief

Usage:
  branchbrief [options]
  branchbrief generate [options]

Options:
  --base <branch>       Base branch to compare against
  --output <file>       Write the branch brief to a file
  --json                Render JSON instead of Markdown
  --risk                Include deterministic risk information (default)
  --copilot             Include Copilot-readable review context
  --fail-on <level>     Exit non-zero at risk level: low, medium, or high
  --repo-root <path>    Repository root to inspect
  --no-color            Disable colorized terminal output
  --quiet               Suppress non-error output
  --version, -v         Print the package version
  --help, -h            Print this help

Examples:
  branchbrief
  branchbrief --base main
  branchbrief --output BRANCH_BRIEF.md
  branchbrief --json
  branchbrief --copilot --fail-on high`;
}

function readValue(args: string[], index: number, flag: string): string {
  const value = args[index];

  if (!value || value.startsWith("--")) {
    throw new BranchBriefError({
      code: "INVALID_ARGUMENT",
      message: `${flag} requires a value.`,
      exitCode: 1,
    });
  }

  return value;
}

function toBranchBriefError(error: unknown): BranchBriefError {
  if (error instanceof BranchBriefError) {
    return error;
  }

  return new BranchBriefError({
    code: "UNEXPECTED_ERROR",
    message: error instanceof Error ? error.message : String(error),
    exitCode: 1,
  });
}

function readPackageVersion(): string {
  let currentDir = __dirname;

  while (true) {
    try {
      const packageJson = JSON.parse(
        readFileSync(join(currentDir, "package.json"), "utf8"),
      ) as { version?: string };

      if (packageJson.version) {
        return packageJson.version;
      }
    } catch {
      // Keep walking likely source/build locations until the filesystem root.
    }

    const parentDir = resolve(currentDir, "..");
    if (parentDir === currentDir) {
      break;
    }

    currentDir = parentDir;
  }

  return "0.0.0";
}

if (require.main === module) {
  runCli()
    .then((exitCode) => {
      process.exitCode = exitCode;
    })
    .catch((error) => {
      process.stderr.write(
        `branchbrief: ${error instanceof Error ? error.message : String(error)}\n`,
      );
      process.exitCode = 1;
    });
}
