import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { detectPackageManager, type PackageManager } from "./detectPackageManager";
import { detectProjectType } from "./detectProjectType";
import { readPackageScripts } from "./readPackageScripts";

export interface VerificationSuggestions {
  provided: false;
  suggestedCommands: string[];
  notes: string[];
}

const packageScriptCommands: Array<{
  script: string;
  command: (packageManager: PackageManager) => string;
}> = [
  { script: "test", command: (packageManager) => `${packageManager} test` },
  {
    script: "typecheck",
    command: (packageManager) => `${packageManager} run typecheck`,
  },
  { script: "lint", command: (packageManager) => `${packageManager} run lint` },
  { script: "build", command: (packageManager) => `${packageManager} run build` },
];

const commonMakeTargets = ["test", "typecheck", "lint", "build"];
const commonJustRecipes = ["test", "typecheck", "lint", "build"];

async function readOptionalFile(path: string): Promise<string> {
  try {
    return await readFile(path, "utf8");
  } catch {
    return "";
  }
}

function appendUnique(values: string[], value: string): void {
  if (!values.includes(value)) {
    values.push(value);
  }
}

function detectMakeTargets(contents: string): Set<string> {
  const targets = new Set<string>();

  for (const line of contents.split(/\r?\n/)) {
    const match = /^([A-Za-z0-9_.-]+)\s*:(?![=])/.exec(line);
    if (match) {
      targets.add(match[1]);
    }
  }

  return targets;
}

function detectJustRecipes(contents: string): Set<string> {
  const recipes = new Set<string>();

  for (const line of contents.split(/\r?\n/)) {
    const match = /^([A-Za-z0-9_-]+)(?:\s+[^:=#]+)?\s*:/.exec(line);
    if (match) {
      recipes.add(match[1]);
    }
  }

  return recipes;
}

async function readJustfile(projectRoot: string): Promise<string> {
  const lowerCaseJustfile = await readOptionalFile(join(projectRoot, "justfile"));
  if (lowerCaseJustfile) {
    return lowerCaseJustfile;
  }

  return readOptionalFile(join(projectRoot, "Justfile"));
}

export async function suggestVerificationCommands(
  projectRoot: string,
): Promise<VerificationSuggestions> {
  const suggestedCommands: string[] = [];
  const notes: string[] = [];
  const projectTypes = await detectProjectType(projectRoot);
  const packageManager = await detectPackageManager(projectRoot);
  const scripts = await readPackageScripts(projectRoot);

  if (projectTypes.node && !packageManager) {
    notes.push("Detected package.json but no known lockfile; using npm for script suggestions.");
  }

  const nodePackageManager = packageManager ?? "npm";
  for (const { script, command } of packageScriptCommands) {
    if (scripts[script]) {
      appendUnique(suggestedCommands, command(nodePackageManager));
    }
  }

  if (projectTypes.make) {
    const makefile = await readOptionalFile(join(projectRoot, "Makefile"));
    const makeTargets = detectMakeTargets(makefile);

    for (const target of commonMakeTargets) {
      if (makeTargets.has(target)) {
        appendUnique(suggestedCommands, `make ${target}`);
      }
    }
  }

  if (projectTypes.just) {
    const justfile = await readJustfile(projectRoot);
    const justRecipes = detectJustRecipes(justfile);

    for (const recipe of commonJustRecipes) {
      if (justRecipes.has(recipe)) {
        appendUnique(suggestedCommands, `just ${recipe}`);
      }
    }
  }

  if (projectTypes.pythonTools.pytest) {
    appendUnique(suggestedCommands, "pytest");
  }

  if (projectTypes.pythonTools.ruff) {
    appendUnique(suggestedCommands, "ruff check .");
  }

  if (projectTypes.pythonTools.mypy) {
    appendUnique(suggestedCommands, "mypy .");
  }

  if (suggestedCommands.length === 0) {
    notes.push("No common verification commands detected.");
  }

  return {
    provided: false,
    suggestedCommands,
    notes,
  };
}
