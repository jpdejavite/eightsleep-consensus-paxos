import { CommandOption } from '../helper/arguments-parser';
import { TimeHelper } from '../helper/time-helper';
import Logger from '../logger';

import Client from './client';

const executeCommands = async (client: Client): Promise<void> => {
  const logger = Logger.get();

  for (const command of client.args.commands) {
    switch (command.option) {
      case CommandOption.Sleep:
        logger.info(`[${client.id()}] sleeping for ${command.value} ms`);
        await TimeHelper.sleep(command.value as number);
        break;
      case CommandOption.StartRequest:
        client.startRequest();
        await TimeHelper.sleep(command.value as number);
        break;
    }
  }
};

export default executeCommands;
