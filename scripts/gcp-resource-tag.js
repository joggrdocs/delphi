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
 * Tag the new Service with the GCP_TAG
 * 
 * @param {object} payload
 * @param {object} payload.env
 */
module.exports = async ({ exec, env }) => {
  const gcpProjectId = getInput(env, 'GCP_PROJECT_ID');
  const gcpRegion = getInput(env, 'GCP_REGION');
  const serviceName = getInput(env, 'SERVICE_NAME');
  const gcpTag = getInput(env, 'GCP_TAG');

  try {
    await exec.exec('gcloud', [
      'resource-manager',
      'tags',
      'bindings',
      'create',
      `--tag-value=${gcpTag}`,
      `--parent=//run.googleapis.com/projects/${gcpProjectId}/locations/${gcpRegion}/services/${serviceName}`,
      `--location=${gcpRegion}`,
    ]);
  } catch (error) {
    console.warn('WARNING: Failed to create resource tag. This may be due to the tag already existing.');
  }

  await exec.exec('gcloud', [
    'run',
    'services',
    'add-iam-policy-binding',
    serviceName,
    '--member=allUsers',
    '--role=roles/run.invoker',
    `--region=${gcpRegion}`,
  ]);
}
