class ProposerArguments {
  constructor(readonly accepterUrls: string[], readonly minimumQuorumSize: number, readonly beginWithN?: number) {
  }
}

const ProposerArgumentsParser = {
  parse(args: string[]): ProposerArguments {
    if (args.length < 4) {
      return new ProposerArguments([], 0);
    }
    return Object.assign(new ProposerArguments([], 0), JSON.parse(args[3]));
  },
  stringify({ accepterUrls, minimumQuorumSize, beginWithN }: { accepterUrls: string[]; minimumQuorumSize: number; beginWithN?: number; }): string {
    return JSON.stringify(new ProposerArguments(accepterUrls, minimumQuorumSize, beginWithN));
  },
};


export { ProposerArgumentsParser, ProposerArguments };
