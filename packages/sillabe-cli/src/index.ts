import { program } from 'commander';
import { installServeCommand } from './commands/serve/index';

const getProgram = (version: string) => {
    program.version(version);

    installServeCommand();

    return program;
};

export default getProgram;
