import runJob from "../job";
import logger from '../lib/logger';

(async () => {
  try {
    logger.info('Starting Job');
    if (!process.env.GCP_PROJECT_ID) {
      throw new Error('GCP_PROJECT_ID is required');
    }

    const serviceNamesToDelete = await runJob(process.env.GCP_PROJECT_ID, process.env.DRY_RUN === 'true')
    if (serviceNamesToDelete.length === 0) {
      logger.info('Skipping: No services to delete');
    } else {
      logger.info(`Completed Deleting Services: ${serviceNamesToDelete.join(', ')}`);
    }
    process.exit(0);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error: ${error.message}`, {
        ...error,
      });
    } else {
      logger.error('Unknown Error', {
        ...new Error('Unknown Error'),
      });
    }

    process.exit(1);
  }
})();
