import { access, readFile } from "node:fs/promises";
import { join } from "node:path";

export interface ProjectTypeDetection {
  node: boolean;
  make: boolean;
  just: boolean;
  python: boolean;
  pythonTools: {
    pytest: boolean;
    ruff: boolean;
    mypy: boolean;
  };
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function readOptionalFile(path: string): Promise<string> {
  try {
    return await readFile(path, "utf8");
  } catch {
    return "";
  }
}

function dependencyFileMentions(contents: string, dependency: string): boolean {
  const dependencyPattern = new RegExp(
    `(^|\\n)\\s*${dependency.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([\\s=<>~!;#]|$)`,
    "i",
  );

  return dependencyPattern.test(contents);
}

export async function detectProjectType(
  projectRoot: string,
): Promise<ProjectTypeDetection> {
  const packageJsonExists = await fileExists(join(projectRoot, "package.json"));
  const pyprojectPath = join(projectRoot, "pyproject.toml");
  const requirementsPath = join(projectRoot, "requirements.txt");
  const pytestIniPath = join(projectRoot, "pytest.ini");
  const pyprojectExists = await fileExists(pyprojectPath);
  const requirementsExists = await fileExists(requirementsPath);
  const pytestIniExists = await fileExists(pytestIniPath);
  const pyproject = await readOptionalFile(pyprojectPath);
  const requirements = await readOptionalFile(requirementsPath);

  return {
    node: packageJsonExists,
    make: await fileExists(join(projectRoot, "Makefile")),
    just:
      (await fileExists(join(projectRoot, "justfile"))) ||
      (await fileExists(join(projectRoot, "Justfile"))),
    python: pyprojectExists || requirementsExists || pytestIniExists,
    pythonTools: {
      pytest:
        pytestIniExists ||
        /\[tool\.pytest\.ini_options\]/.test(pyproject) ||
        dependencyFileMentions(requirements, "pytest"),
      ruff:
        /\[tool\.ruff/.test(pyproject) ||
        dependencyFileMentions(requirements, "ruff"),
      mypy:
        /\[tool\.mypy\]/.test(pyproject) ||
        dependencyFileMentions(requirements, "mypy"),
    },
  };
}
