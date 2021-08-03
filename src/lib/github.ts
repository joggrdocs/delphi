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
[//]: # (bn-bottom-start)
---
🚀 **BlueNova Deployment**

**Preview Url:** [${url}](${url})

[//]: # (bn-bottom-end)
  `.trim();
}

async function updatePullRequest (updater: { (currentDescription: string | null): string }) {
  const prNumber = getPullRequestNumber();
  core.info(`PR NUMBER: ${getPullRequestNumber()}`);
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

function cleanDescription (description: string) {
  return _.chain(description)
    .trimStart(MARK_BN_TOP_END)
    .trimEnd(MARK_BN_BOTTOM_START)
    .value();
}

// Public Methods
// -----

export async function appendToPullDescription (url: string): Promise<void> {
  await updatePullRequest((currentDescription) => {
    return `
${cleanDescription(currentDescription || '')}    
${getFinishedDescription(url)}
`;
  });
}

export async function prependToPullDescription (): Promise<void> {
  await updatePullRequest((currentDescription) => {
    return `
${getRunningDescription()}
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
