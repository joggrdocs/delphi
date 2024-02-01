import type { TimeRange } from "../lib/cloudRun";
import runJob from "../job";
import logger from '../lib/logger';

(async () => {
  try {
    logger.debug('Starting Job');

    if (!process.env.GCP_PROJECT_ID) {
      throw new Error('GCP_PROJECT_ID is required');
    }

    const serviceNamesToDelete = await runJob({
      projectId: process.env.GCP_PROJECT_ID,
      dryRun: process.env.DRY_RUN === 'true',
      timeRange: process.env.TIME_RANGE as TimeRange,
    })
    if (serviceNamesToDelete.length === 0) {
      logger.info('Skipping: No services to delete');
    } else {
      logger.info(`Completed Deleting Services: ${serviceNamesToDelete.join(', ')}`);
    }
    process.exit(0);
  } catch (error) {
    if (error instanceof Error) {
      logger.fatal(error, `Error: ${error.message}`);
    } else {
      logger.fatal(new Error('Unknown Error'), 'Unknown Error');
    }

    process.exit(1);
  }
})();
