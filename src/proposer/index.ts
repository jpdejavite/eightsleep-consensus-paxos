import { ArgumentsParser } from '../helper/arguments-parser';
import FileReader from '../helper/file-reader';
import Requester from '../helper/requester';

import executeCommands from './proposer-command-executor';
import startServer from './proposer-server';
import Proposer from './proposer';
import { ProposerArgumentsParser } from './proposer-arguments-parser';

const start = async () => {
  const args = ArgumentsParser.parse(process.argv);
  const proposerArgs = ProposerArgumentsParser.parse(process.argv);
  const proposer = new Proposer(args, proposerArgs, new FileReader(), new Requester());
  await startServer(proposer);
  await executeCommands(proposer);
};

start();
