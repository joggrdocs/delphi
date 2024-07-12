/**
 * Get input from the environment
 * 
 * @param {Node.env} env 
 * @param {string} name 
 * @returns 
 */
function getInput(env, name) {
  return env[name];
}

/**
 * Get multiline input from the environment
 * 
 * @param {Node.env} env 
 * @param {string} name 
 * @returns Array<string> 
 */
function getMultilineInput(env, name) {
  const input = getInput(env, name);
  return input ? input.split("\n").filter(input => !!input) : [];
}

/**
 * Build & Push Docker Image 
 * 
 * @param {import('@types/github-script').AsyncFunctionArguments} payload
 */
module.exports = async ({ github, context, exec, core, env }) => {
  const dockerBuildArgs = getMultilineInput(env, 'DOCKER_BUILD_ARGS');
  const dockerTags = getInput(env, 'DOCKER_TAGS') ?? '';
  const gcpProjectId = getInput(env, 'GCP_PROJECT_ID');
  const gcpArtifactRepository = getInput(env, 'GCP_ARTIFACT_REPOSITORY');
  const name = getInput(env, 'NAME');
  const dockerDirectory = getInput(env, 'DOCKER_DIRECTORY');
  const dockerFileName = getInput(env, 'DOCKER_FILE_NAME');
  const githubSha = getInput(env, 'GITHUB_SHA');
  const dockerCache = getInput(env, 'DOCKER_CACHE') === 'gha';

  const fullImageName = `us-docker.pkg.dev/${gcpProjectId}/${gcpArtifactRepository}/${name}`;

  const tags = [];
  if (dockerTags) {
    dockerTags
      .split(',')
      .forEach((tag) => {
        tags.push(...['--tag', `${fullImageName}:${tag}`]);
      });
  }

  const buildArgs = [];
  dockerBuildArgs
    .filter((arg) => !!arg)
    .forEach((arg) => {
      const [key, value] = arg.trim().split('=');
      buildArgs.push(...['--build-arg', `${key}=${value}`]);
    });

  await exec.exec('docker', [
    'buildx',
    'build',
    '--push',
    '--cache-from',
    'type=gha',
    '--cache-to',
    'type=gha,mode=max',
    ...buildArgs,
    ...tags,
    '--tag',
    `${fullImageName}:${githubSha}`,
     '--file',
    `${dockerDirectory}/${dockerFileName}`,
    `${dockerDirectory}`
  ]);
}
