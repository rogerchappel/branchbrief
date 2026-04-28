import { strict as assert } from "node:assert";
import test from "node:test";
import { renderCopilotReviewContext } from "../../src/output/copilot.ts";
import { renderJsonBranchBrief } from "../../src/output/json.ts";
import { renderMarkdownBranchBrief } from "../../src/output/markdown.ts";
import { sampleBranchBriefInput } from "./fixtures.ts";

test("includes copilot markdown section only when requested", () => {
  const input = {
    ...sampleBranchBriefInput,
    options: {
      ...sampleBranchBriefInput.options,
      copilot: true,
    },
  };
  const markdown = renderMarkdownBranchBrief(input);

  assert.equal(markdown.includes("## Copilot Review Context"), true);
  assert.equal(markdown.includes("- Risk level: low"), true);
  assert.equal(
    markdown.includes("- low - src/output/markdown.ts: pure renderer changed"),
    true,
  );
});

test("includes copilot json context only when requested", () => {
  const withoutCopilot = JSON.parse(renderJsonBranchBrief(sampleBranchBriefInput));
  const withCopilot = JSON.parse(
    renderJsonBranchBrief({
      ...sampleBranchBriefInput,
      options: {
        ...sampleBranchBriefInput.options,
        copilot: true,
      },
    }),
  );

  assert.equal(withoutCopilot.copilotReviewContext, undefined);
  assert.deepEqual(withCopilot.copilotReviewContext.focus, [
    "Risk level: low",
    "Sensitive files changed",
    "Public API changes",
    "Config or CI changes",
    "Missing tests",
    "Verification gaps",
    "Rollback concerns",
  ]);
});

test("renders standalone copilot review context deterministically", () => {
  assert.equal(
    renderCopilotReviewContext(sampleBranchBriefInput),
    `Review this branch with attention to:

- Risk level: low
- Sensitive files changed
- Public API changes
- Config or CI changes
- Missing tests
- Verification gaps
- Rollback concerns

Risk signals:

- low - src/output/markdown.ts: pure renderer changed

Verification gaps:

- Verification was not provided.
- Suggested command: node --test tests/output/*.test.ts
- Suggested command: git diff --check

Rollback concerns:

- Confirm the listed commits can be reverted cleanly if issues are found.`,
  );
});
