import * as cloudRun from './lib/cloudRun';

/**
 * Runs the job to delete services
 * 
 * @param projectId A GCP project ID
 * @param dryRun If true, the job will not delete any services
 * @returns The service names that were deleted
 */
async function runJob(projectId: string, dryRun: boolean = false) {
  const services = await cloudRun.listServices(
    cloudRun.buildParent(projectId),
    [
      {
        field: 'labels',
        label: 'group',
        operation: 'equalTo',
        value: 'previews',
      },
      {
        field: 'age',
        operation: 'greaterThanOrEqualTo',
        value: '30 days',
      }
    ]
  );

  const serviceNamesToDelete = services.map((service) => service.serviceName);
  if (dryRun) {
    console.log(`Dry Run: ${serviceNamesToDelete.join(', ')}`);
    return [];
  } else if (serviceNamesToDelete.length !== 0) {
    console.log(`Starting Deleting Services: ${serviceNamesToDelete.join(', ')}`);
    await cloudRun.deleteServices(serviceNamesToDelete);
    return serviceNamesToDelete;
  } else {
    return [];
  }
}

export default runJob;
