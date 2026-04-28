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
