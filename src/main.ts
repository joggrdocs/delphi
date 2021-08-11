import * as core from '@actions/core';

import LaunchPad from './lib/launchpad';
import * as github from './lib/github';
import Docker from './lib/docker';

async function run (): Promise<void> {
  try {
    const serviceAccountKey = core.getInput('service_account_key');
    const directory = core.getInput('directory');
    const apiKey = core.getInput('api_key');
    const name = core.getInput('name');

    // Update description that a deploy is in flight
    if (github.isPullRequest()) {
      await github.prependToPullDescription(
        github.getRunningDescription()
      );
    }

    core.info(JSON.stringify(process.env));
    core.info('------');
    core.info(JSON.stringify(process.env.GITHUB_ENV));

    const launchpad = new LaunchPad({
      name,
      apiKey
    });
    await launchpad.setup();

    // Build & Push Image to LaunchPad repository
    const docker = new Docker({
      serviceAccountKey,
      name,
      directory,
      projectId: launchpad.projectId as string,
      slug: launchpad.slugId as string,
      apiKey: apiKey
    });
    await docker.setup();
    await docker.buildAndPush();

    // Deploy built image to LaunchPad Cloud
    const result = await launchpad.createDeployment();

    // Add Preview URL to PR
    if (github.isPullRequest()) {
      await github.prependToPullDescription(
        github.getFinishedDescription(result.url)
      );
    }
  } catch (error) {
    // await github.resetPullDescription();
    core.setFailed(error.message);
  }
}

run();
