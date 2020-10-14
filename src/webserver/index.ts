import http from 'http';
import * as logger from '../utils/logger';
import { app } from './app';

export const createAndStartWebserver = () => {
  return new Promise((resolve, reject) => {
    const server = http.createServer(app);

    server.on('error', (err) => {
      return reject(err);
    });

    const port = 3000;
    server.listen(port, () => {
      logger.log(`Web server listening on port ${port}`);
      return resolve();
    });
  });
};
