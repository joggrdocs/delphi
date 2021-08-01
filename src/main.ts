import * as core from '@actions/core';

async function run (): Promise<void> {
  try {
    // Inputs: Docker file location

    // RUN: Build Image
    // RUN: Push Image (VERY CAREFUL)
    // RUN: Deploy Service
    // RUN: Edit Description (similar to dependabot)
    // RUN: Inject Preview into description

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
