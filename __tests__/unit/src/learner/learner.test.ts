import HttpStatus from 'http-status-codes';

import Learner from '../../../../src/learner/learner';
import { LearnerArguments } from '../../../../src/learner/learner-arguments-parser';
import { Arguments } from '../../../../src/helper/arguments-parser';
import LearnInput from '../../../../src/entity/learn-input';


describe('Learner', () => {
  test('learn n and value ok', async () => {

    const requester = { get: jest.fn(), post: jest.fn() };

    const args = new Arguments(0, []);
    const learnerArgs = new LearnerArguments(false, 'teste');
    const learner = new Learner(args, learnerArgs, requester);


    requester.post.mockResolvedValue({
      status: HttpStatus.OK,
      data: {},
    });

    await learner.learn(1, 'val');

    expect(requester.post.mock.calls.length).toBe(1);
    expect(requester.post.mock.calls[0][0]).toBe('teste/client/learn');
    expect(requester.post.mock.calls[0][1]).toStrictEqual(new LearnInput(1, 'val'));

    expect(learner.getLearnedN()).toBe(1);
    expect(learner.getLearnedValue()).toBe('val');
  });

  test('learn n and value ok, learn again', async () => {

    const requester = { get: jest.fn(), post: jest.fn() };

    const args = new Arguments(0, []);
    const learnerArgs = new LearnerArguments(false, 'teste');
    const learner = new Learner(args, learnerArgs, requester);


    requester.post.mockResolvedValue({
      status: HttpStatus.OK,
      data: {},
    });

    await learner.learn(1, 'val');
    await learner.learn(2, 'val-2');

    expect(requester.post.mock.calls.length).toBe(2);
    expect(requester.post.mock.calls[0][0]).toBe('teste/client/learn');
    expect(requester.post.mock.calls[0][1]).toStrictEqual(new LearnInput(1, 'val'));
    expect(requester.post.mock.calls[1][0]).toBe('teste/client/learn');
    expect(requester.post.mock.calls[1][1]).toStrictEqual(new LearnInput(2, 'val-2'));

    expect(learner.getLearnedN()).toBe(2);
    expect(learner.getLearnedValue()).toBe('val-2');
  });

  test('learn n and value not ok', async () => {

    const requester = { get: jest.fn(), post: jest.fn() };

    const args = new Arguments(0, []);
    const learnerArgs = new LearnerArguments(false, 'teste');
    const learner = new Learner(args, learnerArgs, requester);


    requester.post.mockResolvedValue({
      status: HttpStatus.OK,
      data: {},
    });

    await learner.learn(1, 'val');
    await learner.learn(1, 'val-2');

    expect(requester.post.mock.calls.length).toBe(1);
    expect(requester.post.mock.calls[0][0]).toBe('teste/client/learn');
    expect(requester.post.mock.calls[0][1]).toStrictEqual(new LearnInput(1, 'val'));

    expect(learner.getLearnedN()).toBe(1);
    expect(learner.getLearnedValue()).toBe('val');
  });

  test('learn do not send response flag', async () => {

    const requester = { get: jest.fn(), post: jest.fn() };

    const args = new Arguments(0, []);
    const learnerArgs = new LearnerArguments(true, 'teste');
    const learner = new Learner(args, learnerArgs, requester);


    requester.post.mockResolvedValue({
      status: HttpStatus.OK,
      data: {},
    });

    await learner.learn(1, 'val');

    expect(requester.post.mock.calls.length).toBe(0);

    expect(learner.getLearnedN()).toBe(1);
    expect(learner.getLearnedValue()).toBe('val');
  });

  test('learn client error on learning', async () => {

    const requester = {
      get: jest.fn(),
      post: jest.fn(() => {
        throw new Error('error!!!');
      }),
    };

    const args = new Arguments(0, []);
    const learnerArgs = new LearnerArguments(false, 'teste');
    const learner = new Learner(args, learnerArgs, requester);


    await learner.learn(1, 'val');

    expect(requester.post.mock.calls.length).toBe(1);

    expect(learner.getLearnedN()).toBe(1);
    expect(learner.getLearnedValue()).toBe('val');
  });
});
