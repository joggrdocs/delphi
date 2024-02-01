import * as cloudRun from './lib/cloudRun';
import logger from './lib/logger';

/**
 * Runs the job to delete services
 * 
 * @param projectId A GCP project ID
 * @param dryRun If true, the job will not delete any services
 * @returns The service names that were deleted
 */
async function runJob(payload: {
  projectId: string,
  dryRun: boolean,
  timeRange?: cloudRun.TimeRange,
}) {
  const {
    projectId,
    dryRun,
    timeRange = '30 days'
  } = payload;

  logger.debug(payload, 'Starting Job');

  const services = await cloudRun.listServices(
    cloudRun.buildParent(projectId),
    [
      {
        field: 'labels',
        label: 'previews',
        operation: 'equalTo',
        value: 'true',
      },
      {
        field: 'age',
        operation: 'greaterThanOrEqualTo',
        value: timeRange,
      }
    ]
  );

  logger.debug(services, `${services.length} Services Found'=`);

  const serviceNamesToDelete = services.map((service) => service.name);
  if (dryRun) {
    logger.debug(`Dry Run: ${serviceNamesToDelete.join(', ')}`);
    return [];
  } else if (serviceNamesToDelete.length !== 0) {
    logger.debug(`Starting Deleting Services: ${serviceNamesToDelete.join(', ')}`);
    await cloudRun.deleteServices(serviceNamesToDelete);
    return serviceNamesToDelete;
  } else {
    return [];
  }
}

export default runJob;
