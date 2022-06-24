import express from 'express';

import Logger from '../logger';

import Client from './client';
import ClientRouter from './client-router';

const startServer = (client: Client): Promise<void> => {
  const clientRouter = new ClientRouter(client);

  const app = express();
  app.use(express.json());
  app.use('/client', clientRouter.router);


  return new Promise((resolve) => {
    app.listen(client.args.port, () => {
      const logger = Logger.get();
      logger.info(`[${client.id()}] started at port ${client.args.port}`);
      resolve();
    });
  });
};

export default startServer;
