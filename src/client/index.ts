import { ArgumentsParser } from '../helper/arguments-parser';

import Client from './client';
import executeCommands from './client-command-executor';
import startServer from './client-server';

const start = async () => {
  const args = ArgumentsParser.parse(process.argv);
  const client = new Client(args);
  await startServer(client);
  await executeCommands(client);
};

start();
