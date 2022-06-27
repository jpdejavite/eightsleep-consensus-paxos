import { ArgumentsParser } from '../helper/arguments-parser';
import Requester from '../helper/requester';

import Learner from './learner';
import { LearnerArgumentsParser } from './learner-arguments-parser';
import executeCommands from './learner-command-executor';
import startServer from './learner-server';

const start = async () => {
  const args = ArgumentsParser.parse(process.argv);
  const learnerArgs = LearnerArgumentsParser.parse(process.argv);
  const learner = new Learner(args, learnerArgs, new Requester());
  await startServer(learner);
  await executeCommands(learner);
};

start();
