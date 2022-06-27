import { CommandOption } from '../helper/arguments-parser';
import { TimeHelper } from '../helper/time-helper';
import Logger from '../logger';

import Proposer from './proposer';

const executeCommands = async (proposer: Proposer): Promise<void> => {
  const logger = Logger.get();

  for (const command of proposer.args.commands) {
    switch (command.option) {
      case CommandOption.Sleep:
        logger.info(`[${proposer.id()}] sleeping for ${command.value} ms`);
        await TimeHelper.sleep(command.value as number);
        break;
      case CommandOption.LookForARequest:
        await proposer.lookForARequest();
        break;
      case CommandOption.ExecuteAccept:
        await proposer.executeAcceptPhase();
        break;

    }
  }
};

export default executeCommands;
