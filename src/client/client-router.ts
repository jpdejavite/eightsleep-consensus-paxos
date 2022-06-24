import express, { Request, Response, Router } from 'express';
import HttpStatus from 'http-status-codes';

import { ArgumentsParser } from '../helper/arguments-parser';

import Client from './client';

export default class ClientRouter {
  router: Router;

  constructor(readonly client: Client) {
    this.router = express.Router();

    this.router.get('/consensusResponse', (req: Request, res: Response) => {
      this.getConsensusEnpointMethod(req, res);
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


}
