class AcceptorArguments {
  constructor(readonly refuseAllProposal: boolean, readonly doTimeout: boolean) {
  }
}

const AcceptorArgumentsParser = {
  parse(args: string[]): AcceptorArguments {
    if (args.length < 4) {
      return new AcceptorArguments(false, false);
    }
    return Object.assign(new AcceptorArguments(false, false), JSON.parse(args[3]));
  },
  stringify({ refuseAllProposal, doTimeout }: { refuseAllProposal: boolean; doTimeout: boolean; }): string {
    return JSON.stringify(new AcceptorArguments(refuseAllProposal, doTimeout));
  },
};


export { AcceptorArgumentsParser, AcceptorArguments };
