class LearnerArguments {
  constructor(readonly doNotSendResponse: boolean, readonly clientUrl: string) {
  }
}

const LearnerArgumentsParser = {
  parse(args: string[]): LearnerArguments {
    if (args.length < 4) {
      return new LearnerArguments(false, '');
    }
    return Object.assign(new LearnerArguments(false, ''), JSON.parse(args[3]));
  },
  stringify({ doNotSendResponse, clientUrl }: { doNotSendResponse: boolean; clientUrl: string; }): string {
    return JSON.stringify(new LearnerArguments(doNotSendResponse, clientUrl));
  },
};


export { LearnerArgumentsParser, LearnerArguments };
