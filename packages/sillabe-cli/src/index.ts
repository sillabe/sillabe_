import { program } from 'commander';
import { installServeCommand } from './commands/serve/serveCommand';
import { installCreateCommand } from './commands/create/createCommand';

const getProgram = (version: string) => {
    program.version(version);

    installServeCommand();
    installCreateCommand();

    return program;
};

export default getProgram;
