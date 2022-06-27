import { CommandOption } from '../helper/arguments-parser';
import { TimeHelper } from '../helper/time-helper';
import Logger from '../logger';

import Acceptor from './acceptor';

const executeCommands = async (acceptor: Acceptor): Promise<void> => {
  const logger = Logger.get();

  for (const command of acceptor.args.commands) {
    switch (command.option) {
      case CommandOption.Sleep:
        logger.info(`[${acceptor.id()}] sleeping for ${command.value} ms`);
        await TimeHelper.sleep(command.value as number);
        break;
    }
  }
};

export default executeCommands;
