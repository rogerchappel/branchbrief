import { readFile } from "node:fs/promises";
import { join } from "node:path";

export type PackageScripts = Record<string, string>;

interface PackageJson {
  scripts?: unknown;
}

export async function readPackageScripts(
  projectRoot: string,
): Promise<PackageScripts> {
  try {
    const rawPackageJson = await readFile(join(projectRoot, "package.json"), "utf8");
    const packageJson = JSON.parse(rawPackageJson) as PackageJson;

    if (!packageJson.scripts || typeof packageJson.scripts !== "object") {
      return {};
    }

    return Object.fromEntries(
      Object.entries(packageJson.scripts).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      ),
    );
  } catch {
    return {};
  }
}
