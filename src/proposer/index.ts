import { ArgumentsParser } from '../helper/arguments-parser';
import FileReader from '../helper/file-reader';

import executeCommands from './proposer-command-executor';
import startServer from './proposer-server';
import Proposer from './proposer';

const start = async () => {
  const args = ArgumentsParser.parse(process.argv);
  const proposer = new Proposer(args, new FileReader());
  await startServer(proposer);
  await executeCommands(proposer);
};

start();
