import express, { Request, Response, Router } from 'express';
import HttpStatus from 'http-status-codes';

import AcceptInput from '../entity/accept-input';
import AcceptOutput from '../entity/accept-output';
import PrepareInput from '../entity/prepare-input';
import PrepareOutput from '../entity/prepare-output';

import Acceptor from './acceptor';

export default class AcceptorRouter {
  router: Router;

  constructor(readonly acceptor: Acceptor) {
    this.router = express.Router();

    this.router.post('/prepare', (req: Request, res: Response) => {
      this.prepareEnpointMethod(req, res);
    });

    this.router.post('/accept', (req: Request, res: Response) => {
      this.acceptEnpointMethod(req, res);
    });
  }

  prepareEnpointMethod(req: Request, res: Response): void {
    try {
      const input: PrepareInput = req.body;
      const status = this.acceptor.prepare(input.n) ? HttpStatus.OK : HttpStatus.CONFLICT;
      res.status(status).json(new PrepareOutput(this.acceptor.getCurrentN()));
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(err && err instanceof Error ? err.message : 'unknow error');
    }
  }

  async acceptEnpointMethod(req: Request, res: Response): Promise<void> {
    try {
      const input: AcceptInput = req.body;
      const status = await this.acceptor.accept(input.n, input.value) ? HttpStatus.OK : HttpStatus.CONFLICT;
      res.status(status).json(new AcceptOutput(this.acceptor.getCurrentN(), this.acceptor.getCurrentValue()));
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(err && err instanceof Error ? err.message : 'unknow error');
    }
  }
}
