import express from 'express';

import Logger from '../logger';

import Acceptor from './acceptor';
import AcceptorRouter from './acceptor-router';

const startServer = (acceptor: Acceptor): Promise<void> => {
  const acceptorRouter = new AcceptorRouter(acceptor);

  const app = express();
  app.use(express.json());
  app.use('/acceptor', acceptorRouter.router);


  return new Promise((resolve) => {
    app.listen(acceptor.args.port, () => {
      const logger = Logger.get();
      logger.info(`[${acceptor.id()}] started at port ${acceptor.args.port}`);
      resolve();
    });
  });
};

export default startServer;
