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

export interface CopilotReviewContext {
  focus: string[];
  riskSignals: string[];
  verificationGaps: string[];
  rollbackConcerns: string[];
}

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
  repo: BranchFacts["repo"];
  branch: BranchFacts["branch"];
  status: BranchFacts["status"];
  commits: BranchFacts["commits"];
  filesChanged: BranchFacts["filesChanged"];
  diffStat: BranchFacts["diffStat"];
  risk: RiskResult;
  verification: VerificationSuggestions;
  options?: {
    copilot?: boolean;
    generatedAt?: string;
  };
}

export interface BranchBriefJson {
  repo: BranchBriefInput["repo"];
  branch: BranchBriefInput["branch"];
  status: BranchBriefInput["status"];
  commits: BranchBriefInput["commits"];
  filesChanged: BranchBriefInput["filesChanged"];
  diffStat: BranchBriefInput["diffStat"];
  risk: BranchBriefInput["risk"];
  verification: BranchBriefInput["verification"];
  generatedAt?: string;
  copilotReviewContext?: CopilotReviewContext;
}

export interface BranchBriefResult {
  content: string;
  format: OutputFormat;
  output?: string;
  risk?: RiskResult;
  failedRiskGate?: {
    threshold: RiskLevel;
    level: RiskLevel;
    message: string;
  };
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
