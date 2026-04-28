export interface BranchFacts {
  repo: {
    name: string;
    root: string;
    remote?: string;
  };
  branch: {
    current: string;
    base: string;
    mergeBase?: string;
  };
  status: {
    dirty: boolean;
    stagedChanges: number;
    unstagedChanges: number;
    untrackedFiles: number;
  };
  commits: Array<{
    sha: string;
    subject: string;
  }>;
  filesChanged: string[];
  diffStat: {
    files: number;
    insertions: number;
    deletions: number;
    raw: string;
  };
}

export type RiskLevel = "low" | "medium" | "high";

export interface RiskSignal {
  id: string;
  level: RiskLevel;
  path?: string;
  reason: string;
}

export interface RiskResult {
  level: RiskLevel;
  notes: string[];
  signals: RiskSignal[];
}

export interface VerificationSuggestions {
  provided: boolean;
  suggestedCommands: string[];
  notes: string[];
}

export type OutputFormat = "markdown" | "json";

export interface BranchBriefOptions {
  base?: string;
  output?: string;
  format: OutputFormat;
  includeRisk: boolean;
  includeCopilotContext: boolean;
  failOn?: RiskLevel;
  repoRoot?: string;
  color: boolean;
  quiet: boolean;
}

export interface BranchBriefInput {
  facts: BranchFacts;
  risk?: RiskResult;
  verification?: VerificationSuggestions;
  options: BranchBriefOptions;
}

export interface BranchBriefResult {
  content: string;
  format: OutputFormat;
  output?: string;
  risk?: RiskResult;
}

export interface BranchBriefAdapters {
  collectBranchFacts?: (options: {
    base?: string;
    cwd?: string;
  }) => Promise<BranchFacts>;
  classifyRisk?: (input: {
    changedFiles: string[];
    diffStat?: BranchFacts["diffStat"];
  }) => RiskResult | Promise<RiskResult>;
  suggestVerification?: (
    repoRoot: string,
  ) => Promise<VerificationSuggestions> | VerificationSuggestions;
  renderBranchBrief?: (
    input: BranchBriefInput,
  ) => Promise<string> | string;
}
