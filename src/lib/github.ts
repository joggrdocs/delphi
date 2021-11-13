import * as github from '@actions/github';
import * as core from '@actions/core';
import * as _ from 'lodash';

// eslint-disable-next-line no-unused-vars
const MARK_BN_TOP_START = '[//]: # (bn-top-start)';
const MARK_BN_TOP_END = '[//]: # (bn-top-end)';
const MARK_BN_BOTTOM_START = '[//]: # (bn-bottom-start)';
// eslint-disable-next-line no-unused-vars
const MARK_BN_BOTTOM_END = '[//]: # (bn-bottom-end)';

// Utils
// -----

export function getRunningDescription (): string {
  return `
[//]: # (bn-top-start)
⚠️  **BlueNova deployment in progress** ⚠️

BlueNova deploying a Preview of this change, please wait until completed before pushing a new commit.

---

[//]: # (bn-top-end)
`.trim();
}

export function getFinishedDescription (url: string): string {
  return `
[//]: # (bn-top-start)

🚀 **BlueNova Deployment** | **Preview Seth:** [${url}](${url})

---

[//]: # (bn-top-end)
  `.trim();
}

export async function addComment (comment: string): Promise<void> {
  const prNumber = getPullRequestNumber();
  const octokit = github.getOctokit(core.getInput('github_token'));

  const { data: issue } = await octokit.rest.issues.createComment({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: prNumber,
    body: comment
  });

  if (!issue) {
    throw new Error(`No such pull request for PR: ${prNumber}`);
  }
}

async function updatePullRequest (updater: {(currentDescription: string | null): string}) {
  const prNumber = getPullRequestNumber();
  const octokit = github.getOctokit(core.getInput('github_token'));

  const { data: pullRequest } = await octokit.rest.pulls.get({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: prNumber
  });

  if (!pullRequest) {
    throw new Error(`No such pull request for PR: ${prNumber}`);
  }

  await octokit.rest.pulls.update({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: pullRequest.number,
    body: updater(pullRequest.body)
  });
}

export function cleanDescription (description: string): string {
  const [, descriptionStart] = description.split(MARK_BN_TOP_END);
  const [descriptionEnd] = (descriptionStart || description).split(MARK_BN_BOTTOM_START);
  return descriptionEnd;
}

// Public Methods
// -----

export async function appendToPullDescription (description: string): Promise<void> {
  await updatePullRequest((currentDescription) => {
    return `
${cleanDescription(currentDescription || '')}
${description}
`;
  });
}

export async function prependToPullDescription (description: string): Promise<void> {
  await updatePullRequest((currentDescription) => {
    return `
${description}
${cleanDescription(currentDescription || '')}
`;
  });
}

export async function resetPullDescription (): Promise<void> {
  await updatePullRequest((currentDescription) => cleanDescription(currentDescription || ''));
}

export function isPullRequest (): boolean {
  return true;
}

export function getPullRequestNumber (): number {
  return Number(
    _.replace(
      _.replace(github.context.ref, 'refs/pull/', ''),
      '/merge',
      ''
    )
  );
}

export function getBranch (): string {
  return _.replace(github.context.ref, 'refs/heads/', '');
}
