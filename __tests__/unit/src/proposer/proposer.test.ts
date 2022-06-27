import HttpStatus from 'http-status-codes';

import Proposer from '../../../../src/proposer/proposer';
import { ProposerArguments } from '../../../../src/proposer/proposer-arguments-parser';
import FileReader from '../../../../src/helper/file-reader';
import Requester from '../../../../src/helper/requester';
import { Arguments } from '../../../../src/helper/arguments-parser';
import PrepareInput from '../../../../src/entity/prepare-input';
import AcceptInput from '../../../../src/entity/accept-input';


const fileReader = new FileReader();

describe('Proposer', () => {
  test('lookForARequest no accepters and no minimum quorum', async () => {

    const args = new Arguments(0, []);
    const proposerArgs = new ProposerArguments([], 0);
    const proposer = new Proposer(args, proposerArgs, fileReader, new Requester());

    await proposer.lookForARequest();

    expect(proposer.canIniateAcceptPhase()).toBe(false);
    expect(proposer.getCurrentN()).toBe(0);
  });

  test('lookForARequest no minimum quorum', async () => {

    const args = new Arguments(0, []);
    const proposerArgs = new ProposerArguments(['test'], 0);
    const proposer = new Proposer(args, proposerArgs, fileReader, new Requester());

    await proposer.lookForARequest();

    expect(proposer.canIniateAcceptPhase()).toBe(false);
    expect(proposer.getCurrentN()).toBe(0);
  });

  test('lookForARequest double call, no new line', async () => {

    const args = new Arguments(0, []);
    const proposerArgs = new ProposerArguments([], 0);
    const proposer = new Proposer(args, proposerArgs, fileReader, new Requester());

    await proposer.lookForARequest();
    await proposer.lookForARequest();

    expect(proposer.canIniateAcceptPhase()).toBe(false);
    expect(proposer.getCurrentN()).toBe(0);
  });

  test('lookForARequest all accepters respond with success', async () => {

    const requester = { get: jest.fn(), post: jest.fn() };

    const args = new Arguments(0, []);
    const proposerArgs = new ProposerArguments(['testa', 'testb'], 2);
    const proposer = new Proposer(args, proposerArgs, fileReader, requester);

    requester.post.mockResolvedValue({
      status: HttpStatus.OK,
      data: {},
    });

    await proposer.lookForARequest();

    expect(requester.post.mock.calls.length).toBe(2);
    expect(requester.post.mock.calls[0][0]).toBe('testa/acceptor/prepare');
    expect(requester.post.mock.calls[0][1]).toStrictEqual(new PrepareInput(1));
    expect(requester.post.mock.calls[1][0]).toBe('testb/acceptor/prepare');
    expect(requester.post.mock.calls[1][1]).toStrictEqual(new PrepareInput(1));

    expect(proposer.canIniateAcceptPhase()).toBe(true);
    expect(proposer.getCurrentN()).toBe(1);
  });


  test('lookForARequest accepters responded with success bigger than minimum quorum, ', async () => {

    const requester = { get: jest.fn(), post: jest.fn() };

    const args = new Arguments(0, []);
    const proposerArgs = new ProposerArguments(['testa', 'testb', 'testc', 'testd'], 2);
    const proposer = new Proposer(args, proposerArgs, fileReader, requester);

    requester.post
      .mockRejectedValueOnce({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      })
      .mockRejectedValueOnce({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      })
      .mockResolvedValue({
        status: HttpStatus.OK,
        data: {},
      });

    await proposer.lookForARequest();

    expect(requester.post.mock.calls.length).toBe(4);
    expect(requester.post.mock.calls[0][0]).toBe('testa/acceptor/prepare');
    expect(requester.post.mock.calls[0][1]).toStrictEqual(new PrepareInput(1));
    expect(requester.post.mock.calls[1][0]).toBe('testb/acceptor/prepare');
    expect(requester.post.mock.calls[1][1]).toStrictEqual(new PrepareInput(1));
    expect(requester.post.mock.calls[2][0]).toBe('testc/acceptor/prepare');
    expect(requester.post.mock.calls[2][1]).toStrictEqual(new PrepareInput(1));
    expect(requester.post.mock.calls[3][0]).toBe('testd/acceptor/prepare');
    expect(requester.post.mock.calls[3][1]).toStrictEqual(new PrepareInput(1));

    expect(proposer.canIniateAcceptPhase()).toBe(true);
    expect(proposer.getCurrentN()).toBe(1);

  });

  test('lookForARequest accepters responded with success lower than minimum quorum, ', async () => {

    const requester = { get: jest.fn(), post: jest.fn() };

    const args = new Arguments(0, []);
    const proposerArgs = new ProposerArguments(['testa', 'testb', 'testc', 'testd'], 2);
    const proposer = new Proposer(args, proposerArgs, fileReader, requester);

    requester.post
      .mockRejectedValueOnce({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      })
      .mockRejectedValueOnce({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      })
      .mockRejectedValueOnce({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      })
      .mockResolvedValue({
        status: HttpStatus.OK,
        data: {},
      });

    await proposer.lookForARequest();

    expect(requester.post.mock.calls.length).toBe(4);
    expect(requester.post.mock.calls[0][0]).toBe('testa/acceptor/prepare');
    expect(requester.post.mock.calls[0][1]).toStrictEqual(new PrepareInput(1));
    expect(requester.post.mock.calls[1][0]).toBe('testb/acceptor/prepare');
    expect(requester.post.mock.calls[1][1]).toStrictEqual(new PrepareInput(1));
    expect(requester.post.mock.calls[2][0]).toBe('testc/acceptor/prepare');
    expect(requester.post.mock.calls[2][1]).toStrictEqual(new PrepareInput(1));
    expect(requester.post.mock.calls[3][0]).toBe('testd/acceptor/prepare');
    expect(requester.post.mock.calls[3][1]).toStrictEqual(new PrepareInput(1));

    expect(proposer.canIniateAcceptPhase()).toBe(false);
    expect(proposer.getCurrentN()).toBe(1);

  });

  test('lookForARequest all accepters respond with error', async () => {

    const requester = {
      get: jest.fn(),
      post: jest.fn(() => {
        throw new Error('error!!!');
      }),
    };

    const args = new Arguments(0, []);
    const proposerArgs = new ProposerArguments(['testa', 'testb'], 2);
    const proposer = new Proposer(args, proposerArgs, fileReader, requester);

    await proposer.lookForARequest();

    expect(proposer.canIniateAcceptPhase()).toBe(false);
    expect(proposer.getCurrentN()).toBe(1);
  });

  test('executeAcceptPhase all accepters respond with success', async () => {

    const requester = { get: jest.fn(), post: jest.fn() };

    const args = new Arguments(0, []);
    const proposerArgs = new ProposerArguments(['testa', 'testb'], 2);
    const proposer = new Proposer(args, proposerArgs, fileReader, requester);

    requester.post.mockResolvedValue({
      status: HttpStatus.OK,
      data: {},
    });

    await proposer.lookForARequest();

    await proposer.executeAcceptPhase();

    expect(requester.post.mock.calls.length).toBe(4);
    expect(requester.post.mock.calls[0][0]).toBe('testa/acceptor/prepare');
    expect(requester.post.mock.calls[0][1]).toStrictEqual(new PrepareInput(1));
    expect(requester.post.mock.calls[1][0]).toBe('testb/acceptor/prepare');
    expect(requester.post.mock.calls[1][1]).toStrictEqual(new PrepareInput(1));

    expect(requester.post.mock.calls[2][0]).toBe('testa/acceptor/accept');
    expect(requester.post.mock.calls[2][1]).toStrictEqual(new AcceptInput(1, 'proposer-0-1'));
    expect(requester.post.mock.calls[3][0]).toBe('testb/acceptor/accept');
    expect(requester.post.mock.calls[3][1]).toStrictEqual(new AcceptInput(1, 'proposer-0-1'));

    expect(proposer.canIniateAcceptPhase()).toBe(true);
    expect(proposer.getCurrentN()).toBe(1);
    expect(proposer.hasBeenAccepted()).toBe(true);
  });

  test('executeAcceptPhase accepters responded with success bigger than minimum quorum, ', async () => {

    const requester = { get: jest.fn(), post: jest.fn() };

    const args = new Arguments(0, []);
    const proposerArgs = new ProposerArguments(['testa', 'testb', 'testc', 'testd'], 2);
    const proposer = new Proposer(args, proposerArgs, fileReader, requester);

    requester.post
      .mockRejectedValueOnce({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      })
      .mockRejectedValueOnce({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      })
      .mockResolvedValueOnce({
        status: HttpStatus.OK,
        data: {},
      })
      .mockResolvedValueOnce({
        status: HttpStatus.OK,
        data: {},
      })
      .mockRejectedValueOnce({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      })
      .mockRejectedValueOnce({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      })
      .mockResolvedValue({
        status: HttpStatus.OK,
        data: {},
      });

    await proposer.lookForARequest();

    await proposer.executeAcceptPhase();

    expect(requester.post.mock.calls.length).toBe(8);
    expect(requester.post.mock.calls[0][0]).toBe('testa/acceptor/prepare');
    expect(requester.post.mock.calls[0][1]).toStrictEqual(new PrepareInput(1));
    expect(requester.post.mock.calls[1][0]).toBe('testb/acceptor/prepare');
    expect(requester.post.mock.calls[1][1]).toStrictEqual(new PrepareInput(1));
    expect(requester.post.mock.calls[2][0]).toBe('testc/acceptor/prepare');
    expect(requester.post.mock.calls[2][1]).toStrictEqual(new PrepareInput(1));
    expect(requester.post.mock.calls[3][0]).toBe('testd/acceptor/prepare');
    expect(requester.post.mock.calls[3][1]).toStrictEqual(new PrepareInput(1));
    expect(requester.post.mock.calls[4][0]).toBe('testa/acceptor/accept');
    expect(requester.post.mock.calls[4][1]).toStrictEqual(new AcceptInput(1, 'proposer-0-1'));
    expect(requester.post.mock.calls[5][0]).toBe('testb/acceptor/accept');
    expect(requester.post.mock.calls[5][1]).toStrictEqual(new AcceptInput(1, 'proposer-0-1'));
    expect(requester.post.mock.calls[6][0]).toBe('testc/acceptor/accept');
    expect(requester.post.mock.calls[6][1]).toStrictEqual(new AcceptInput(1, 'proposer-0-1'));
    expect(requester.post.mock.calls[7][0]).toBe('testd/acceptor/accept');
    expect(requester.post.mock.calls[7][1]).toStrictEqual(new AcceptInput(1, 'proposer-0-1'));


    expect(proposer.canIniateAcceptPhase()).toBe(true);
    expect(proposer.getCurrentN()).toBe(1);
    expect(proposer.hasBeenAccepted()).toBe(true);
  });
});
