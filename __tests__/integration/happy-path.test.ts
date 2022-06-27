import { fork, ChildProcess } from 'child_process';

import HttpStatus from 'http-status-codes';
import axios from 'axios';

import { ArgumentsParser, Command, CommandOption } from '../../src/helper/arguments-parser';
import { TimeHelper } from '../../src/helper/time-helper';
import { Constants } from '../constants/constants';
import { ProposerArgumentsParser } from '../../src/proposer/proposer-arguments-parser';
import { AcceptorArgumentsParser } from '../../src/acceptor/acceptor-arguments-parser';

const totalTime = 6000;
const clientPort = 3000;
let clientProcess: ChildProcess;

const proposerPort = 3001;
let proposerProcess: ChildProcess;

const acceptor1Port = 3002;
let acceptor1Process: ChildProcess;

const acceptor2Port = 3003;
let acceptor2Process: ChildProcess;

afterAll(() => {
  clientProcess.kill();
  proposerProcess.kill();
  acceptor1Process.kill();
  acceptor2Process.kill();
});


test('happt path, all accept and consensus is obtained', async () => {
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
      AcceptorArgumentsParser.stringify({ doTimeout: false, refuseAllProposal: false }),
    ],
  );

  acceptor2Process = fork(
    Constants.acceptorIndexFilePath,
    [
      ArgumentsParser.stringify({ port: acceptor2Port, commands: [] }),
      AcceptorArgumentsParser.stringify({ doTimeout: false, refuseAllProposal: false }),
    ],
  );

  await TimeHelper.sleep(5000);

  const response = await axios.get(`${Constants.localUrl}:${clientPort}/client/consensusResponse`);

  expect(response.status).toBe(HttpStatus.OK);
  expect(response.data).toBeNull();

}, totalTime + Constants.initServerTime + Constants.testAdditionalTimeout);

