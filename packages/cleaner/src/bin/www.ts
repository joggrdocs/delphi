import runJob from "src/job";

if (!process.env.GCP_PROJECT_ID) {
  throw new Error('GCP_PROJECT_ID is required');
}

runJob(process.env.GCP_PROJECT_ID)
  .then((serviceNamesToDelete) => {
    if (serviceNamesToDelete.length === 0) {
      console.log('Skipping: No services to delete');
    } else {
      console.log(`Completed Deleting Services: ${serviceNamesToDelete.join(', ')}`);
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error(error, 'Error');
    process.exit(1);
  });