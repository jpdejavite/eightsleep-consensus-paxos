import express, { Request, Response, Router } from 'express';
import HttpStatus from 'http-status-codes';

import LearnInput from '../entity/learn-input';

import Learner from './learner';

export default class LearnerRouter {
  router: Router;

  constructor(readonly learner: Learner) {
    this.router = express.Router();

    this.router.post('/learn', (req: Request, res: Response) => {
      this.prepareEnpointMethod(req, res);
    });
  }

  async prepareEnpointMethod(req: Request, res: Response): Promise<void> {
    try {
      const input: LearnInput = req.body;
      await this.learner.learn(input.n, input.value);
      res.status(HttpStatus.OK).json({});
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(err && err instanceof Error ? err.message : 'unknow error');
    }
  }
}
