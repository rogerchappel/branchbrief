export type RiskLevel = "low" | "medium" | "high";

export interface BranchBriefInput {
  repo: {
    name: string;
    root?: string;
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
  risk: {
    level: RiskLevel;
    notes: string[];
    signals: Array<{
      level: RiskLevel;
      path?: string;
      reason: string;
    }>;
  };
  verification: {
    provided: boolean;
    suggestedCommands: string[];
  };
  options?: {
    copilot?: boolean;
    generatedAt?: string;
  };
}

export interface CopilotReviewContext {
  focus: string[];
  riskSignals: string[];
  verificationGaps: string[];
  rollbackConcerns: string[];
}

export interface BranchBriefJson {
  repo: BranchBriefInput["repo"];
  branch: BranchBriefInput["branch"];
  status: BranchBriefInput["status"];
  commits: BranchBriefInput["commits"];
  filesChanged: string[];
  diffStat: BranchBriefInput["diffStat"];
  risk: BranchBriefInput["risk"];
  verification: BranchBriefInput["verification"];
  generatedAt?: string;
  copilotReviewContext?: CopilotReviewContext;
}
