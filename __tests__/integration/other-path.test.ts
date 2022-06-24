import { fork, ChildProcess } from 'child_process';

import HttpStatus from 'http-status-codes';
import axios from 'axios';

import { ArgumentsParser, Command, CommandOption } from '../../src/helper/arguments-parser';
import { TimeHelper } from '../../src/helper/time-helper';
import { Constants } from '../constants/constants';

const totalTime = 3000;
const clientPort = 3000;
let clientProcess: ChildProcess;

afterAll(() => {
  clientProcess.kill();
});


test('other test', async () => {
  clientProcess = fork(Constants.clientIndexFilePath, [ArgumentsParser.stringify({
    port: clientPort, commands: [
      new Command(CommandOption.Sleep, 2000),
    ],
  })]);

  await TimeHelper.sleep(3000);

  const response = await axios.get(`${Constants.localUrl}:${clientPort}/client/consensusResponse/`);

  expect(response.status).toBe(HttpStatus.OK);
  expect(response.data).toBeNull();

}, totalTime + Constants.initServerTime + Constants.testAdditionalTimeout);

