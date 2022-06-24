import { CommandOption } from '../helper/arguments-parser';
import { TimeHelper } from '../helper/time-helper';
import Logger from '../logger';

import Client from './client';

const executeCommands = async (client: Client): Promise<void> => {
  const logger = Logger.get();

  for (const command of client.args.commands) {
    if (command.option === CommandOption.Sleep) {
      logger.info(`[${client.id()}] sleeping for ${command.value} ms`);
      await TimeHelper.sleep(command.value as number);
    }
  }
};

export default executeCommands;
