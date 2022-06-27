import { CommandOption } from '../helper/arguments-parser';
import { TimeHelper } from '../helper/time-helper';
import Logger from '../logger';

import Learner from './learner';

const executeCommands = async (learner: Learner): Promise<void> => {
  const logger = Logger.get();

  for (const command of learner.args.commands) {
    switch (command.option) {
      case CommandOption.Sleep:
        logger.info(`[${learner.id()}] sleeping for ${command.value} ms`);
        await TimeHelper.sleep(command.value as number);
        break;
    }
  }
};

export default executeCommands;
