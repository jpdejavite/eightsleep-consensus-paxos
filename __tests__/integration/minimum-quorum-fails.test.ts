import { fork, ChildProcess } from 'child_process';

import HttpStatus from 'http-status-codes';
import axios from 'axios';

import { ArgumentsParser, Command, CommandOption } from '../../src/helper/arguments-parser';
import { TimeHelper } from '../../src/helper/time-helper';
import { Constants } from '../constants/constants';
import { ProposerArgumentsParser } from '../../src/proposer/proposer-arguments-parser';
import { AcceptorArgumentsParser } from '../../src/acceptor/acceptor-arguments-parser';
import { LearnerArgumentsParser } from '../../src/learner/learner-arguments-parser';

const totalTime = 6000;
const clientPort = 3000;
let clientProcess: ChildProcess;

const proposerPort = 3001;
let proposerProcess: ChildProcess;

const acceptor1Port = 3002;
let acceptor1Process: ChildProcess;

const acceptor2Port = 3003;
let acceptor2Process: ChildProcess;

const learner1Port = 3004;
let learner1Process: ChildProcess;

const learner2Port = 3005;
let learner2Process: ChildProcess;

afterAll(() => {
  clientProcess.kill();
  proposerProcess.kill();
  acceptor1Process.kill();
  acceptor2Process.kill();
  learner1Process.kill();
  learner2Process.kill();
});


test('minimum quorum fail, cannot obtain consensus', async () => {
  clientProcess = fork(
    Constants.clientIndexFilePath,
    [
      ArgumentsParser.stringify({
        port: clientPort, commands: [
          new Command(CommandOption.StartRequest, ''),
          new Command(CommandOption.Sleep, 2000),
        ],
      }),
    ],
  );

  proposerProcess = fork(
    Constants.proposerIndexFilePath,
    [
      ArgumentsParser.stringify({
        port: proposerPort, commands: [
          new Command(CommandOption.Sleep, 1000),
          new Command(CommandOption.LookForARequest, ''),
          new Command(CommandOption.ExecuteAccept, ''),
        ],
      }),
      ProposerArgumentsParser.stringify({
        accepterUrls: [
          `${Constants.localUrl}:${acceptor1Port}`,
          `${Constants.localUrl}:${acceptor2Port}`,
        ],
        minimumQuorumSize: 2,
      }),
    ],
  );

  acceptor1Process = fork(
    Constants.acceptorIndexFilePath,
    [
      ArgumentsParser.stringify({ port: acceptor1Port, commands: [] }),
      AcceptorArgumentsParser.stringify({
        doTimeout: false,
        refuseAllProposal: true,
        learnerUrls: [`${Constants.localUrl}:${learner1Port}`, `${Constants.localUrl}:${learner2Port}`],
      }),
    ],
  );

  acceptor2Process = fork(
    Constants.acceptorIndexFilePath,
    [
      ArgumentsParser.stringify({ port: acceptor2Port, commands: [] }),
      AcceptorArgumentsParser.stringify({
        doTimeout: false,
        refuseAllProposal: true,
        learnerUrls: [`${Constants.localUrl}:${learner1Port}`, `${Constants.localUrl}:${learner2Port}`],
      }),
    ],
  );

  learner1Process = fork(
    Constants.learnerIndexFilePath,
    [
      ArgumentsParser.stringify({ port: learner1Port, commands: [] }),
      LearnerArgumentsParser.stringify({ clientUrl: `${Constants.localUrl}:${clientPort}`, doNotSendResponse: false }),
    ],
  );

  learner2Process = fork(
    Constants.learnerIndexFilePath,
    [
      ArgumentsParser.stringify({ port: learner2Port, commands: [] }),
      LearnerArgumentsParser.stringify({ clientUrl: `${Constants.localUrl}:${clientPort}`, doNotSendResponse: false }),
    ],
  );

  await TimeHelper.sleep(5000);

  const response = await axios.get(`${Constants.localUrl}:${clientPort}/client/consensusResponse`);

  expect(response.status).toBe(HttpStatus.OK);
  expect(response.data).toBeNull();

}, totalTime + Constants.initServerTime + Constants.testAdditionalTimeout);

