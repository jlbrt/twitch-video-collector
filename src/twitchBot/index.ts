import tmi from 'tmi.js';
import * as eventHandlers from './eventHandlers';
import { env } from '../env';

export const createAndStartBot = async () => {
  const tmiClientOptions: tmi.Options = {
    connection: {
      reconnect: true,
      secure: true,
    },
    channels: [
      `${env.targetTwitchChannel.startsWith('#') ? '' : '#'}${
        env.targetTwitchChannel
      }`,
    ],
  };

  const tmiClient = tmi.client(tmiClientOptions);

  tmiClient.on('connected', eventHandlers.handleConnected);
  tmiClient.on('message', eventHandlers.handleMessage);

  await tmiClient.connect();
};
