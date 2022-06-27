import { Arguments, ArgumentsParser, CommandOption } from '../../../../src/helper/arguments-parser';

describe('ArgumentsParser', () => {
  test('parse empty args array', () => {
    expect(ArgumentsParser.parse([])).toStrictEqual(new Arguments(0, []));
  });

  test('parse args array with length 1', () => {
    expect(ArgumentsParser.parse(['test'])).toStrictEqual(new Arguments(0, []));
  });

  test('parse args array with length 4', () => {
    expect(ArgumentsParser.parse(['test', 'test', '{"port": 3000, "commands":[{"option":0,"value":"123"}]}']))
      .toStrictEqual(new Arguments(3000, [{ option: CommandOption.Sleep, value: '123' }]));
  });

  test('stringify valid args', () => {
    expect(ArgumentsParser.stringify(new Arguments(3000, [{ option: CommandOption.Sleep, value: '123' }])))
      .toBe('{"port":3000,"commands":[{"option":0,"value":"123"}]}');
  });
});
