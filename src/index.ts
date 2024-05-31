import path from 'node:path';
import * as twitchBot from './twitchBot';
import * as envValidator from './utils/envValidator';
import * as webServer from './webserver';
import * as cronJobs from './cronJobs';
import { dbConnection } from './DAO/db';

(async () => {
  await envValidator.validateEnvironmentVars();

  await dbConnection.migrate.latest({
    directory: path.join(__dirname, '../migrations'),
  });

  await Promise.all([
    twitchBot.createAndStartBot(),
    webServer.createAndStartWebserver(),
    cronJobs.registerCronjobs(),
  ]);
})();
