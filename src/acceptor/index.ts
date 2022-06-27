import { ArgumentsParser } from '../helper/arguments-parser';
import Requester from '../helper/requester';

import Acceptor from './acceptor';
import { AcceptorArgumentsParser } from './acceptor-arguments-parser';
import executeCommands from './acceptor-command-executor';
import startServer from './acceptor-server';

const start = async () => {
  const args = ArgumentsParser.parse(process.argv);
  const acceptorArgs = AcceptorArgumentsParser.parse(process.argv);
  const acceptor = new Acceptor(args, acceptorArgs, new Requester());
  await startServer(acceptor);
  await executeCommands(acceptor);
};

start();
