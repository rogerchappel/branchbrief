export const parseRemoteRepoName = (remote: string): string | undefined => {
  const trimmed = remote.trim();

  if (!trimmed) {
    return undefined;
  }

  const withoutTrailingSlash = trimmed.replace(/\/+$/, "");
  const lastSegment = withoutTrailingSlash.split(/[/:]/).pop();

  if (!lastSegment) {
    return undefined;
  }

  return lastSegment.replace(/\.git$/, "") || undefined;
};

export const repoNameFromRoot = (root: string): string => {
  return root.replace(/\/+$/, "").split("/").pop() ?? root;
};

export const detectRepoName = (root: string, remote?: string): string => {
  return (remote ? parseRemoteRepoName(remote) : undefined) ?? repoNameFromRoot(root);
};
