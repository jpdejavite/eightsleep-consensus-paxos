import HttpStatus from 'http-status-codes';

import Acceptor from '../../../../src/acceptor/acceptor';
import FileReader from '../../../../src/helper/file-reader';
import { Arguments } from '../../../../src/helper/arguments-parser';
import { AcceptorArguments } from '../../../../src/acceptor/acceptor-arguments-parser';
import Requester from '../../../../src/helper/requester';
import LearnInput from '../../../../src/entity/learn-input';


const fileReader = new FileReader();

describe('Acceptor', () => {
  test('prepare with refuese all flag', () => {

    const args = new Arguments(0, []);
    const acceptorArgs = new AcceptorArguments(true, false, ['teste']);
    const acceptor = new Acceptor(args, acceptorArgs, new Requester());

    expect(acceptor.prepare(1)).toBe(false);

    expect(acceptor.getCurrentN()).toBe(0);
    expect(acceptor.getCurrentValue()).toBeUndefined();
  });

  test('prepare with n greater than current n', () => {

    const args = new Arguments(0, []);
    const acceptorArgs = new AcceptorArguments(false, false, ['teste']);
    const acceptor = new Acceptor(args, acceptorArgs, new Requester());

    expect(acceptor.prepare(1)).toBe(true);

    expect(acceptor.getCurrentN()).toBe(1);
    expect(acceptor.getCurrentValue()).toBeUndefined();
  });

  test('prepare with n lower than current n', () => {

    const args = new Arguments(0, []);
    const acceptorArgs = new AcceptorArguments(false, false, ['teste']);
    const acceptor = new Acceptor(args, acceptorArgs, new Requester());

    expect(acceptor.prepare(2)).toBe(true);
    expect(acceptor.prepare(1)).toBe(false);

    expect(acceptor.getCurrentN()).toBe(2);
    expect(acceptor.getCurrentValue()).toBeUndefined();
  });


  test('accept with n equal to prepare n', async () => {
    const requester = { get: jest.fn(), post: jest.fn() };
    const args = new Arguments(0, []);
    const acceptorArgs = new AcceptorArguments(false, false, ['teste']);
    const acceptor = new Acceptor(args, acceptorArgs, requester);

    requester.post.mockResolvedValue({
      status: HttpStatus.OK,
      data: {},
    });

    expect(acceptor.prepare(1)).toBe(true);
    expect(await acceptor.accept(1, 'test')).toBe(true);

    expect(requester.post.mock.calls.length).toBe(1);
    expect(requester.post.mock.calls[0][0]).toBe('teste/learner/learn');
    expect(requester.post.mock.calls[0][1]).toStrictEqual(new LearnInput(1, 'test'));

    expect(acceptor.getCurrentN()).toBe(1);
    expect(acceptor.getCurrentValue()).toBe('test');
  });

  test('accept with n lower than prepare n', async () => {
    const requester = {
      get: jest.fn(),
      post: jest.fn(() => {
        throw new Error('error!!!');
      }),
    };
    const args = new Arguments(0, []);
    const acceptorArgs = new AcceptorArguments(false, false, ['teste']);
    const acceptor = new Acceptor(args, acceptorArgs, requester);


    expect(acceptor.prepare(2)).toBe(true);
    expect(await acceptor.accept(2, 'test')).toBe(true);
    expect(await acceptor.accept(1, 'test-2')).toBe(false);

    expect(requester.post.mock.calls.length).toBe(1);

    expect(acceptor.getCurrentN()).toBe(2);
    expect(acceptor.getCurrentValue()).toBe('test');
  });
});
