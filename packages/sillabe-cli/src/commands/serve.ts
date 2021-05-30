import { Command, flags } from '@oclif/command';
import { getConfiguration } from '../functions/getConfiguration';
import { validateConfiguration } from '../functions/validateConfiguration';
import { createServer } from '../functions/createServer';
import { routeServer } from '../functions/routeServer';
import { getSillabe } from '../functions/getSillabe';

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

        const sillabe = getSillabe(root, configuration);
        const server = createServer(root, configuration);

        routeServer(server, sillabe, flags.port);
    }
}
