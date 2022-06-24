import * as fs from 'fs';

import { Arguments } from '../helper/arguments-parser';
import { TimeHelper } from '../helper/time-helper';
import Logger from '../logger';

export default class Proposer {
  logger: any;
  private lastLineRead?: string;

  constructor(readonly args: Arguments) {
    this.logger = Logger.get();
  }


  id(): string {
    return `proposer-${this.args.port}`;
  }

  public async lookForARequest(): Promise<void> {
    const fileData = fs.readFileSync('client-requests.txt', { encoding: 'utf8', flag: 'r' });
    const lines = fileData.split('\n');
    const lastLine = lines[lines.length - 1];
    if (lastLine === this.lastLineRead) {
      this.logger.info(`[${this.id()}] no new request found in file`);
    } else {
      this.logger.info(`[${this.id()}] new request found, executing prepare`);
      this.lastLineRead = lastLine;

      await TimeHelper.sleep(100);
    }
  }
}
