import * as twitchBot from './twitchBot';
import * as envValidator from './utils/envValidator';
import * as webServer from './webserver';
import * as cronJobs from './cronJobs';

(async () => {
  await envValidator.validateEnvironmentVars();

  await Promise.all([
    twitchBot.createAndStartBot(),
    webServer.createAndStartWebserver(),
    cronJobs.registerCronjobs(),
  ]);
})();
