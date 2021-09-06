import * as core from '@actions/core';

import LaunchPad from './lib/launchpad';
import * as github from './lib/github';
import Docker from './lib/docker';
import { parseEnvVars } from './lib/environment';

async function run (): Promise<void> {
  try {
    throw new Error('THIS IS A TEST');

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

    const launchpad = new LaunchPad({
      name,
      apiKey,
      envVars: parseEnvVars(process.env as Record<string, string>)
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
    await github.addComment(`
### LaunchPad Error

LaunchPad failed to deploy, please contact support at 
[support@bluenova.io](mailto:support@bluenova.io?subject=LaunchPad Error&body=Error Message: ${error.message}).

<details>
  <summary>Error Message</summary>
  \`${error.message}\` 
</details>
    `);
    core.setFailed(error.message);
  }
}

run();
