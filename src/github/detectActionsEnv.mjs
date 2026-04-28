export function detectActionsEnv(env = process.env) {
  const get = (name) => {
    const value = env[name];
    return typeof value === "string" && value.length > 0 ? value : null;
  };

  return {
    isGitHubActions: get("GITHUB_ACTIONS") === "true",
    baseRef: get("GITHUB_BASE_REF"),
    headRef: get("GITHUB_HEAD_REF"),
    refName: get("GITHUB_REF_NAME"),
    repository: get("GITHUB_REPOSITORY"),
    stepSummaryPath: get("GITHUB_STEP_SUMMARY"),
  };
}

