const { getInput, getMultilineInput } = require('../utils');


/**
 * Build & Push Docker Image 
 * 
 * @param {object} payload
 * @param {object} payload.context
 * @param {object} payload.core
 * @param {object} payload.github
 * @param {object} payload.exec
 */
module.exports = async ({ github, context, exec, core, env }) => {
  const dockerBuildArgs = getMultilineInput(env, 'DOCKER_BUILD_ARGS');
  const gcpProjectId = getInput(env, 'GCP_PROJECT_ID');
  const gcpArtifactRepository = getInput(env, 'GCP_ARTIFACT_REPOSITORY');
  const name = getInput(env, 'NAME');
  const dockerDirectory = getInput(env, 'DOCKER_DIRECTORY');
  const dockerFileName = getInput(env, 'DOCKER_FILE_NAME');
  const githubSha = getInput(env, 'GITHUB_SHA');

  const buildArgs = dockerBuildArgs
    .filter((arg) => !!arg)
    .map((arg) => {
      const [key, value] = arg.trim().split('=');
      args.push(`--build-arg ${key}=${value}`);
    });

  await exec.exec('docker', [
    'buildx',
    'build',
    ...buildArgs,
    `--tag us-docker.pkg.dev/${gcpProjectId}/${gcpArtifactRepository}/${name}:${githubSha}`,
    `--file ${dockerDirectory}/${dockerFileName}`,
    `${dockerDirectory}`
  ]);
  await exec.exec('docker', [
    'push',
    `us-docker.pkg.dev/${gcpProjectId}/${gcpArtifactRepository}/${name}:${githubSha}`
  ]);
}
