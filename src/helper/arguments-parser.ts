enum CommandOption {
  Sleep,
  StartRequest,
}

class Command {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(readonly option: CommandOption, readonly value: any) { }
}
class Arguments {

  constructor(readonly port: number, readonly commands: Command[]) {
  }
}

const ArgumentsParser = {
  parse(args: string[]): Arguments {
    return JSON.parse(args[2]);
  },
  stringify({ port, commands }: { port: number; commands: Command[]; }): string {
    return JSON.stringify(new Arguments(port, commands));
  },
};


export { ArgumentsParser, Arguments, Command, CommandOption };
