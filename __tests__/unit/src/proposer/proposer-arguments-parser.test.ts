import { ProposerArguments, ProposerArgumentsParser } from '../../../../src/proposer/proposer-arguments-parser';


describe('ProposerArgumentsParser', () => {
  test('parse empty args array', () => {
    expect(ProposerArgumentsParser.parse([])).toStrictEqual(new ProposerArguments([], 0));
  });

  test('parse args array with length 1', () => {
    expect(ProposerArgumentsParser.parse(['test'])).toStrictEqual(new ProposerArguments([], 0));
  });

  test('parse args array with length 4', () => {
    expect(ProposerArgumentsParser.parse(['test', 'test', 'test', '{"accepterUrls": ["abc"], "minimumQuorumSize":1}']))
      .toStrictEqual(new ProposerArguments(['abc'], 1));
  });

  test('stringify valid args', () => {
    expect(ProposerArgumentsParser.stringify(new ProposerArguments(['abc'], 1)))
      .toBe('{"accepterUrls":["abc"],"minimumQuorumSize":1}');
  });
});
