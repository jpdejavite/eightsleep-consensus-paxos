import Acceptor from '../../../../src/acceptor/acceptor';
import FileReader from '../../../../src/helper/file-reader';
import { Arguments } from '../../../../src/helper/arguments-parser';
import { AcceptorArguments } from '../../../../src/acceptor/acceptor-arguments-parser';


const fileReader = new FileReader();

describe('Acceptor', () => {
  test('prepare with refuese all flag', () => {

    const args = new Arguments(0, []);
    const acceptorArgs = new AcceptorArguments(true, false);
    const acceptor = new Acceptor(args, acceptorArgs);

    expect(acceptor.prepare(1)).toBe(false);

    expect(acceptor.getCurrentN()).toBe(0);
    expect(acceptor.getCurrentValue()).toBeUndefined();
  });

  test('prepare with n greater than current n', () => {

    const args = new Arguments(0, []);
    const acceptorArgs = new AcceptorArguments(false, false);
    const acceptor = new Acceptor(args, acceptorArgs);

    expect(acceptor.prepare(1)).toBe(true);

    expect(acceptor.getCurrentN()).toBe(1);
    expect(acceptor.getCurrentValue()).toBeUndefined();
  });

  test('prepare with n lower than current n', () => {

    const args = new Arguments(0, []);
    const acceptorArgs = new AcceptorArguments(false, false);
    const acceptor = new Acceptor(args, acceptorArgs);

    expect(acceptor.prepare(2)).toBe(true);
    expect(acceptor.prepare(1)).toBe(false);

    expect(acceptor.getCurrentN()).toBe(2);
    expect(acceptor.getCurrentValue()).toBeUndefined();
  });


  test('accept with n equal to prepare n', () => {

    const args = new Arguments(0, []);
    const acceptorArgs = new AcceptorArguments(false, false);
    const acceptor = new Acceptor(args, acceptorArgs);

    expect(acceptor.prepare(1)).toBe(true);
    expect(acceptor.accept(1, 'test')).toBe(true);

    expect(acceptor.getCurrentN()).toBe(1);
    expect(acceptor.getCurrentValue()).toBe('test');
  });

  test('accept with n lower than prepare n', () => {

    const args = new Arguments(0, []);
    const acceptorArgs = new AcceptorArguments(false, false);
    const acceptor = new Acceptor(args, acceptorArgs);

    expect(acceptor.prepare(2)).toBe(true);
    expect(acceptor.accept(2, 'test')).toBe(true);
    expect(acceptor.accept(1, 'test-2')).toBe(false);

    expect(acceptor.getCurrentN()).toBe(2);
    expect(acceptor.getCurrentValue()).toBe('test');
  });
});
