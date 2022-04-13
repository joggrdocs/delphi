import * as core from '@actions/core';

import LaunchPad, { validateAppName } from './lib/launchpad';
import * as github from './lib/github';
import Docker from './lib/docker';
import { parseListInputs } from './lib/parser';

async function run (): Promise<void> {
  try {
    const serviceAccountKey = core.getInput('service_account_key');
    const directory = core.getInput('directory');
    const dockerfile = core.getInput('dockerfile');
    const apiKey = core.getInput('api_key');
    const name = core.getInput('name');
    const buildArgs = core.getInput('build_args');
    const envVars = core.getInput('env_vars');
    const port = core.getInput('port');

    validateAppName(name);

    // Update description that a deploy is in flight
    if (github.isPullRequest()) {
      await github.prependToPullDescription(github.getRunningDescription());
    }

    const launchpad = new LaunchPad({
      name,
      port,
      apiKey,
      envVars
    });

    await launchpad.setup();
    await launchpad.registerEvents();

    // Build & Push Image to LaunchPad repository
    const docker = new Docker({
      serviceAccountKey,
      name,
      directory,
      dockerfile,
      projectId: launchpad.projectId as string,
      slug: launchpad.slugId as string,
      buildArgs: parseListInputs(buildArgs),
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

    core.setOutput('url', result.url);
  } catch (error) {
    const message = (error as Error)?.message ?? 'Unknown Fatal Error';
    await github.addComment(`
### LaunchPad Error

LaunchPad failed to deploy, please contact support at [support@bluenova.io](mailto:support@bluenova.io).

<details>
  <summary>Error Message</summary>
  <code>
    ${message}
  </code>
</details>
    `);
    core.setFailed(message);
  }
}

run();
