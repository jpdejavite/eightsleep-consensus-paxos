import { fork, ChildProcess } from 'child_process';

import HttpStatus from 'http-status-codes';
import axios from 'axios';

import { ArgumentsParser, Command, CommandOption } from '../../src/helper/arguments-parser';
import { TimeHelper } from '../../src/helper/time-helper';
import { Constants } from '../constants/constants';

const totalTime = 6000;
const clientPort = 3000;
let clientProcess: ChildProcess;

const proposerPort = 3001;
let proposerProcess: ChildProcess;

afterAll(() => {
  clientProcess.kill();
  proposerProcess.kill();
});


test('happt path, all accept and consensus is obtained', async () => {
  clientProcess = fork(Constants.clientIndexFilePath, [ArgumentsParser.stringify({
    port: clientPort, commands: [
      new Command(CommandOption.StartRequest, ''),
      new Command(CommandOption.Sleep, 2000),
    ],
  })]);

  proposerProcess = fork(Constants.proposerIndexFilePath, [ArgumentsParser.stringify({
    port: proposerPort, commands: [
      new Command(CommandOption.Sleep, 1000),
      new Command(CommandOption.LookForARequest, ''),
      new Command(CommandOption.LookForARequest, ''),
    ],
  })]);

  await TimeHelper.sleep(5000);

  const response = await axios.get(`${Constants.localUrl}:${clientPort}/client/consensusResponse/`);

  expect(response.status).toBe(HttpStatus.OK);
  expect(response.data).toBeNull();

}, totalTime + Constants.initServerTime + Constants.testAdditionalTimeout);

