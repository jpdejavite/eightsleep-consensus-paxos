import express from 'express';

import Logger from '../logger';

import Learner from './learner';
import LearnerRouter from './learner-router';

const startServer = (learner: Learner): Promise<void> => {
  const learnerRouter = new LearnerRouter(learner);

  const app = express();
  app.use(express.json());
  app.use('/learner', learnerRouter.router);


  return new Promise((resolve) => {
    app.listen(learner.args.port, () => {
      const logger = Logger.get();
      logger.info(`[${learner.id()}] started at port ${learner.args.port}`);
      resolve();
    });
  });
};

export default startServer;
