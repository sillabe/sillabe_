import { join } from 'path';
import { Command, flags } from '@oclif/command';
import { Sillabe } from '@sillabe/core';
import { getConfiguration } from '../functions/getConfiguration';
import { validateConfiguration } from '../functions/validateConfiguration';
import { createServer } from '../functions/createServer';
import { routeServer } from '../functions/routeServer';

export default class Serve extends Command {
    static description = 'Serve the website locally and watch for changes';
    static examples = [];
    static flags = {
        help: flags.help({ char: 'h' }),
        port: flags.string({ char: 'p', default: '8080' }),
    };
    static args = [];

    async run() {
        const root = process.cwd();
        const { flags } = this.parse(Serve);
        const configuration = getConfiguration(root);

        validateConfiguration(root, configuration);

        const sillabe = Sillabe.createFromPath(join(root, configuration.content));
        const server = createServer(root, configuration);

        routeServer(server, sillabe, flags.port);
    }
}
