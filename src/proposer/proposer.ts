import { Arguments } from '../helper/arguments-parser';
import FileReader from '../helper/file-reader';
import { TimeHelper } from '../helper/time-helper';
import Logger from '../logger';

export default class Proposer {
  logger: any;
  private lastLineRead?: string;

  constructor(readonly args: Arguments, readonly fileReader: FileReader) {
    this.logger = Logger.get();
  }


  id(): string {
    return `proposer-${this.args.port}`;
  }

  public async lookForARequest(): Promise<void> {
    const lines = this.fileReader.readRequestFile().split('\n');
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
