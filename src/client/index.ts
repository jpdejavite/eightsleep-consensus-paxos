import { ArgumentsParser } from '../helper/arguments-parser';
import FileReader from '../helper/file-reader';

import Client from './client';
import executeCommands from './client-command-executor';
import startServer from './client-server';

const start = async () => {
  const args = ArgumentsParser.parse(process.argv);
  const client = new Client(args, new FileReader());
  await startServer(client);
  await executeCommands(client);
};

start();
