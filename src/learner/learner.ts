import Requester from '../helper/requester';
import { Arguments } from '../helper/arguments-parser';
import Logger from '../logger';
import LearnInput from '../entity/learn-input';

import { LearnerArguments } from './learner-arguments-parser';

export default class Learner {
  logger: any;
  private learnedN?: number;
  private learnedValue?: string;

  constructor(readonly args: Arguments, readonly learnerArgs: LearnerArguments, readonly requester: Requester) {
    this.logger = Logger.get();
  }

  getLearnedN(): number {
    return this.learnedN || 0;
  }

  getLearnedValue(): string {
    return this.learnedValue || '';
  }

  id(): string {
    return `learner-${this.args.port}`;
  }

  async learn(proposedN: number, proposedValue: string): Promise<boolean> {
    if (proposedN > (this.learnedN || 0)) {
      this.logger.info(`[${this.id()}] learned value`);
      this.learnedN = proposedN;
      this.learnedValue = proposedValue;

      if (this.learnerArgs.doNotSendResponse) {
        this.logger.info(`[${this.id()}] do not send response`);
        return false;
      }

      try {
        this.logger.info(`[${this.id()}] informing client`);
        await this.requester.post(`${this.learnerArgs.clientUrl}/client/learn`, new LearnInput(this.learnedN, this.learnedValue));
      } catch (error) {
        this.logger.info(`[${this.id()}] client error ${error}`);
      }

      return true;
    }

    this.logger.info(`[${this.id()}] refused to learn`);
    return false;
  }
}
