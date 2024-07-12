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
  const githubHeadRef = getInput(env, 'GITHUB_HEAD_REF');
  const dockerCache = (getInput(env, 'DOCKER_CACHE') ?? 'false') === 'true';

  const fullImageName = `us-docker.pkg.dev/${gcpProjectId}/${gcpArtifactRepository}/${name}`;
  const branchName = githubHeadRef.replace('refs/heads/', '');

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

  //  docker buildx build --push -t <registry>/<image> \
  // --cache-to type=registry,ref=<registry>/<cache-image>:<branch> \
  // --cache-from type=registry,ref=<registry>/<cache-image>:<branch> \
  // --cache-from type=registry,ref=<registry>/<cache-image>:main .

  // @see https://docs.docker.com/build/cache/backends/#multiple-caches
  const cacheArgs = [];
  if (dockerCache) {
    cacheArgs.push(
      '--cache-from',
      `type=registry,ref=${fullImageName}:${branchName}`,
      '--cache-to',
      `type=registry,ref=${fullImageName}:${branchName}`,
      // '--cache-from',
      // `type=registry,ref=${fullImageName}:main`,
      // '--cache-to',
      // `type=registry,ref=${fullImageName}:main`,
    );
  }
  
  await exec.exec('docker', [
    'buildx',
    'build',
    ...buildArgs,
    ...tags,
    '--tag',
    `${fullImageName}:${githubSha}`,
    ...cacheArgs,
    '--file',
    `${dockerDirectory}/${dockerFileName}`,
    `${dockerDirectory}`
  ]);
  await exec.exec('docker', [
    'push',
    fullImageName,
    '--all-tags'
  ]);
}
