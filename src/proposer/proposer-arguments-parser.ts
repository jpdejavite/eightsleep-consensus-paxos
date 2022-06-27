class ProposerArguments {
  constructor(readonly accepterUrls: string[], readonly minimumQuorumSize: number) {
  }
}

const ProposerArgumentsParser = {
  parse(args: string[]): ProposerArguments {
    if (args.length < 4) {
      return new ProposerArguments([], 0);
    }
    return Object.assign(new ProposerArguments([], 0), JSON.parse(args[3]));
  },
  stringify({ accepterUrls, minimumQuorumSize }: { accepterUrls: string[]; minimumQuorumSize: number; }): string {
    return JSON.stringify(new ProposerArguments(accepterUrls, minimumQuorumSize));
  },
};


export { ProposerArgumentsParser, ProposerArguments };
