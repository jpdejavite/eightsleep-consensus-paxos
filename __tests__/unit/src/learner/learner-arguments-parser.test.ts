import { LearnerArguments, LearnerArgumentsParser } from '../../../../src/learner/learner-arguments-parser';

describe('LearnerArgumentsParser', () => {
  test('parse empty args array', () => {
    expect(LearnerArgumentsParser.parse([])).toStrictEqual(new LearnerArguments(false, ''));
  });

  test('parse args array with length 1', () => {
    expect(LearnerArgumentsParser.parse(['test'])).toStrictEqual(new LearnerArguments(false, ''));
  });

  test('parse args array with length 4', () => {
    expect(LearnerArgumentsParser.parse(['test', 'test', 'test', '{"doNotSendResponse": true, "clientUrl": "test"}']))
      .toStrictEqual(new LearnerArguments(true, 'test'));
  });

  test('stringify valid args', () => {
    expect(LearnerArgumentsParser.stringify(new LearnerArguments(true, 'test')))
      .toBe('{"doNotSendResponse":true,"clientUrl":"test"}');
  });
});
