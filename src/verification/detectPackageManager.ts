import { access } from "node:fs/promises";
import { join } from "node:path";

export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

const lockfilePackageManagers: Array<{
  lockfile: string;
  packageManager: PackageManager;
}> = [
  { lockfile: "pnpm-lock.yaml", packageManager: "pnpm" },
  { lockfile: "package-lock.json", packageManager: "npm" },
  { lockfile: "yarn.lock", packageManager: "yarn" },
  { lockfile: "bun.lockb", packageManager: "bun" },
];

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function detectPackageManager(
  projectRoot: string,
): Promise<PackageManager | undefined> {
  for (const { lockfile, packageManager } of lockfilePackageManagers) {
    if (await fileExists(join(projectRoot, lockfile))) {
      return packageManager;
    }
  }

  return undefined;
}
