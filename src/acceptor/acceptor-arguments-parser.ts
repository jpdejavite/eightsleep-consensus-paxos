class AcceptorArguments {
  constructor(readonly refuseAllProposal: boolean, readonly doTimeout: boolean, readonly learnerUrls: string[]) {
  }
}

const AcceptorArgumentsParser = {
  parse(args: string[]): AcceptorArguments {
    if (args.length < 4) {
      return new AcceptorArguments(false, false, []);
    }
    return Object.assign(new AcceptorArguments(false, false, []), JSON.parse(args[3]));
  },
  stringify({ refuseAllProposal, doTimeout, learnerUrls }: { refuseAllProposal: boolean; doTimeout: boolean; learnerUrls: string[]; }): string {
    return JSON.stringify(new AcceptorArguments(refuseAllProposal, doTimeout, learnerUrls));
  },
};


export { AcceptorArgumentsParser, AcceptorArguments };
