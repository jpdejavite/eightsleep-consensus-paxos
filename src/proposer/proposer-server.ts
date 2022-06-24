import express from 'express';

import Logger from '../logger';

import Proposer from './proposer';
import ProposerRouter from './proposer-router';

const startServer = (proposer: Proposer): Promise<void> => {
  const proposerRouter = new ProposerRouter(proposer);

  const app = express();
  app.use(express.json());
  app.use('/proposer', proposerRouter.router);


  return new Promise((resolve) => {
    app.listen(proposer.args.port, () => {
      const logger = Logger.get();
      logger.info(`[${proposer.id()}] started at port ${proposer.args.port}`);
      resolve();
    });
  });
};

export default startServer;
