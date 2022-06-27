import AcceptInput from '../entity/accept-input';
import PrepareInput from '../entity/prepare-input';
import { Arguments } from '../helper/arguments-parser';
import FileReader from '../helper/file-reader';
import Requester from '../helper/requester';
import Logger from '../logger';

import { ProposerArguments } from './proposer-arguments-parser';

class AcceptPromiseResponse {
  constructor(readonly success: boolean, readonly response: any) { }
}

export default class Proposer {
  logger: any;
  private lastLineRead?: string;
  private currentN: number;
  private hasAcceptorsMinimumQuorumSize: boolean;
  private hasBeenAcceptedFlag: boolean;

  constructor(
    readonly args: Arguments,
    readonly propserArgs: ProposerArguments,
    readonly fileReader: FileReader,
    readonly requester: Requester,
  ) {
    this.logger = Logger.get();
    this.currentN = 0;
    this.hasAcceptorsMinimumQuorumSize = false;
    this.hasBeenAcceptedFlag = false;
    if (this.propserArgs.beginWithN && this.propserArgs.beginWithN > 0) {
      this.currentN = this.propserArgs.beginWithN;
    }
  }

  getCurrentN(): number {
    return this.currentN;
  }

  getAcceptValue(): string {
    return `proposer-${this.args.port}-${this.currentN}`;
  }

  id(): string {
    return `proposer-${this.args.port}`;
  }

  public canIniateAcceptPhase(): boolean {
    return this.hasAcceptorsMinimumQuorumSize;
  }

  public hasBeenAccepted(): boolean {
    return this.hasBeenAcceptedFlag;
  }


  public async lookForARequest(): Promise<void> {
    const lines = this.fileReader.readRequestFile().split('\n');
    const lastLine = lines[lines.length - 1];
    if (lastLine === this.lastLineRead) {
      this.logger.info(`[${this.id()}] no new request found in file`);
      this.hasAcceptorsMinimumQuorumSize = false;
      return;
    }

    this.logger.info(`[${this.id()}] new request found, executing prepare`);
    this.lastLineRead = lastLine;

    if (this.propserArgs.accepterUrls.length === 0 || this.propserArgs.minimumQuorumSize === 0) {
      this.hasAcceptorsMinimumQuorumSize = false;
      return;
    }

    await this.executePreparePhase();
  }

  public async executePreparePhase(): Promise<void> {
    this.currentN++;
    this.hasBeenAcceptedFlag = false;
    const promises = this.propserArgs.accepterUrls.map<Promise<AcceptPromiseResponse>>((accepterUrl) => {
      return new Promise((resolve) => {
        try {
          this.requester.post(`${accepterUrl}/acceptor/prepare`, new PrepareInput(this.currentN))
            .then((response) => {
              resolve(new AcceptPromiseResponse(true, response));
            })
            .catch((error) => {
              resolve(new AcceptPromiseResponse(false, error));
            });
        } catch (error) {
          resolve(new AcceptPromiseResponse(false, error));
        }
      });
    });

    this.logger.info(`[${this.id()}] communicating with accepters, asking for prepare`);
    const promisesResponses = await Promise.all(promises);

    this.logger.info(`[${this.id()}] processing accepters prepare responses`);
    const accepterWhoAccepted = promisesResponses.reduce<number>((previousValue, currentResponse) => {
      if (!currentResponse.success) {
        return previousValue;
      }
      return previousValue + 1;
    }, 0);
    this.hasAcceptorsMinimumQuorumSize = accepterWhoAccepted >= this.propserArgs.minimumQuorumSize;
  }

  public async executeAcceptPhase(): Promise<void> {
    this.hasBeenAcceptedFlag = false;
    const promises = this.propserArgs.accepterUrls.map<Promise<AcceptPromiseResponse>>((accepterUrl) => {
      return new Promise((resolve) => {
        try {
          this.requester.post(`${accepterUrl}/acceptor/accept`, new AcceptInput(this.currentN, this.getAcceptValue()))
            .then((response) => {
              resolve(new AcceptPromiseResponse(true, response));
            })
            .catch((error) => {
              resolve(new AcceptPromiseResponse(false, error));
            });
        } catch (error) {
          resolve(new AcceptPromiseResponse(false, error));
        }
      });
    });

    this.logger.info(`[${this.id()}] communicating with accepters, asking to accept`);
    const promisesResponses = await Promise.all(promises);

    this.logger.info(`[${this.id()}] processing accepters accept responses`);
    const accepterWhoAccepted = promisesResponses.reduce<number>((previousValue, currentResponse) => {
      if (!currentResponse.success) {
        return previousValue;
      }
      return previousValue + 1;
    }, 0);
    this.hasBeenAcceptedFlag = accepterWhoAccepted >= this.propserArgs.minimumQuorumSize;
  }
}
