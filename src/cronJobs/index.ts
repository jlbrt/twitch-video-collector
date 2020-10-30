import cron from 'cron';
import * as logger from '../utils/logger';
import { dbConnection } from '../dao/db';

export const registerCronjobs = () => {
  const clearDatabaseJob = new cron.CronJob(
    '0 0 10 * * *',
    async () => {
      logger.log('Clearing videos and suggestions...');
      try {
        await dbConnection.raw('TRUNCATE "videos" CASCADE;');
        logger.log('Successfully cleared videos and suggestions');
      } catch (err) {
        logger.log('error while clearing videos and suggestions', err);
      }
    },
    null,
    false,
    'Europe/Berlin'
  );

  clearDatabaseJob.start();

  logger.log('Cronjobs registered');
};
