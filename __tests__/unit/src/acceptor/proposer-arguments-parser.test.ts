import { AcceptorArguments, AcceptorArgumentsParser } from '../../../../src/acceptor/acceptor-arguments-parser';


describe('AcceptorArgumentsParser', () => {
  test('parse empty args array', () => {
    expect(AcceptorArgumentsParser.parse([])).toStrictEqual(new AcceptorArguments(false, false, []));
  });

  test('parse args array with length 1', () => {
    expect(AcceptorArgumentsParser.parse(['test'])).toStrictEqual(new AcceptorArguments(false, false, []));
  });

  test('parse args array with length 4', () => {
    expect(AcceptorArgumentsParser.parse(['test', 'test', 'test', '{"refuseAllProposal": true, "doTimeout":false, "learnerUrls": ["teste"]}']))
      .toStrictEqual(new AcceptorArguments(true, false, ['teste']));
  });

  test('stringify valid args', () => {
    expect(AcceptorArgumentsParser.stringify(new AcceptorArguments(true, false, ['teste'])))
      .toBe('{"refuseAllProposal":true,"doTimeout":false,"learnerUrls":["teste"]}');
  });
});
