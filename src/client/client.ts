import * as fs from 'fs';

import ConsensusResponse from '../entity/consensus-response';
import { Arguments } from '../helper/arguments-parser';
import Logger from '../logger';

export default class Client {
  logger: any;
  private currentResponse?: ConsensusResponse;

  constructor(readonly args: Arguments) {
    this.logger = Logger.get();
  }

  setCurrentResponse(response: ConsensusResponse): void {
    this.currentResponse = response;
  }

  getCurrentResponse(): ConsensusResponse | null {
    return this.currentResponse || null;
  }

  id(): string {
    return `client-${this.args.port}`;
  }

  startRequest(): void {
    const currentTime = new Date();
    fs.writeFileSync('client-requests.txt', `${this.id()} requests a new response at ${currentTime}\n`, { flag: 'a+' });
    this.logger.info(`[${this.id()}] writed request at ${currentTime}`);
  }
}
