export interface BranchBriefErrorOptions {
  code: string;
  message: string;
  exitCode?: number;
  details?: string[];
}

export class BranchBriefError extends Error {
  readonly code: string;
  readonly exitCode: number;
  readonly details: string[];

  constructor(options: BranchBriefErrorOptions) {
    super(options.message);
    this.name = "BranchBriefError";
    this.code = options.code;
    this.exitCode = options.exitCode ?? 1;
    this.details = options.details ?? [];
  }
}

export function integrationNotWiredError(missing: string[]): BranchBriefError {
  return new BranchBriefError({
    code: "INTEGRATION_NOT_WIRED",
    exitCode: 2,
    message:
      "branchbrief integration modules are not wired yet. Merge the git/risk/output/verification agents before running generation.",
    details: missing,
  });
}
