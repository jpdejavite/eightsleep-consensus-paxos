import { Arguments } from '../helper/arguments-parser';
import Logger from '../logger';

import { AcceptorArguments } from './acceptor-arguments-parser';

export default class Acceptor {
  logger: any;
  private currentN: number;
  private currentValue?: string;

  constructor(readonly args: Arguments, readonly acceptorArgs: AcceptorArguments) {
    this.logger = Logger.get();
    this.currentN = 0;
  }

  getCurrentN(): number {
    return this.currentN;
  }

  getCurrentValue(): string | undefined {
    return this.currentValue;
  }

  id(): string {
    return `acceptor-${this.args.port}`;
  }

  prepare(proposedN: number): boolean {
    if (this.acceptorArgs.refuseAllProposal) {
      this.logger.info(`[${this.id()}] refuse all proposal mode on`);
      return false;
    }
    if (proposedN > this.currentN) {
      this.logger.info(`[${this.id()}] accepted prepare`);
      this.currentN = proposedN;
      return true;
    }

    this.logger.info(`[${this.id()}] refused prepare`);
    return false;
  }

  accept(proposedN: number, proposedValue: string): boolean {
    if (proposedN === this.currentN) {
      this.logger.info(`[${this.id()}] accepted value`);
      this.currentValue = proposedValue;
      return true;
    }

    this.logger.info(`[${this.id()}] refused accept`);
    return false;
  }
}
