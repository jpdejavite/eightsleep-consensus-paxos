import LearnInput from '../entity/learn-input';
import { Arguments } from '../helper/arguments-parser';
import Requester from '../helper/requester';
import Logger from '../logger';

import { AcceptorArguments } from './acceptor-arguments-parser';

export default class Acceptor {
  logger: any;
  private currentN: number;
  private currentValue?: string;

  constructor(readonly args: Arguments, readonly acceptorArgs: AcceptorArguments, readonly requester: Requester) {
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

  async accept(proposedN: number, proposedValue: string): Promise<boolean> {
    if (proposedN === this.currentN) {
      this.logger.info(`[${this.id()}] accepted value`);
      this.currentValue = proposedValue;


      const promises = this.acceptorArgs.learnerUrls.map((learnerUrl) => {
        return new Promise((resolve) => {
          try {
            this.requester.post(`${learnerUrl}/learner/learn`, new LearnInput(this.currentN, this.currentValue || ''))
              .then(resolve)
              .catch(resolve);
          } catch (error) {
            this.logger.info(`[${this.id()}] learner error ${error}`);
            resolve(true);
          }
        });
      });

      this.logger.info(`[${this.id()}] communicating with learners, asking to learn`);
      await Promise.all(promises);
      this.logger.info(`[${this.id()}] communicating with learners done`);

      return true;
    }

    this.logger.info(`[${this.id()}] refused accept`);
    return false;
  }
}
