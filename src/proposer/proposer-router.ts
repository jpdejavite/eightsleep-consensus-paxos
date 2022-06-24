import express, { Router } from 'express';

import Proposer from './proposer';

export default class ProposerRouter {
  router: Router;

  constructor(readonly proposer: Proposer) {
    this.router = express.Router();
  }

}
