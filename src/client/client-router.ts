import express, { Request, Response, Router } from 'express';
import HttpStatus from 'http-status-codes';

import ConsensusResponse from '../entity/consensus-response';
import LearnInput from '../entity/learn-input';
import { ArgumentsParser } from '../helper/arguments-parser';

import Client from './client';

export default class ClientRouter {
  router: Router;

  constructor(readonly client: Client) {
    this.router = express.Router();

    this.router.get('/consensusResponse', (req: Request, res: Response) => {
      this.getConsensusEnpointMethod(req, res);
    });

    this.router.post('/learn', (req: Request, res: Response) => {
      this.learnEnpointMethod(req, res);
    });
  }

  getConsensusEnpointMethod(req: Request, res: Response): void {
    try {
      res.status(HttpStatus.OK).json(this.client.getCurrentResponse());
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(err && err instanceof Error ? err.message : 'unknow error');
    }
  }

  learnEnpointMethod(req: Request, res: Response): void {
    try {
      const input: LearnInput = req.body;
      this.client.setCurrentResponse(new ConsensusResponse(input.n, input.value));
      res.status(HttpStatus.OK).json(this.client.getCurrentResponse());
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(err && err instanceof Error ? err.message : 'unknow error');
    }
  }


}
