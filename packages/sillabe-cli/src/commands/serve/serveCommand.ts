import { program } from 'commander';
import { getConfiguration } from '../../functions/getConfiguration';
import { getSillabe } from '../../functions/getSillabe';
import { routeServer } from '../../functions/routeServer';
import { validateConfiguration } from '../../functions/validateConfiguration';

export const installServeCommand = () => {
    program
        .command('serve')
        .description('Serve the website locally and watch for changes')
        .option('-p, --port <port>', 'Port to bind to', '8080')
        .action((options) => {
            const root = process.cwd();
            const port = options.port;
            const configuration = getConfiguration(root);

            validateConfiguration(root, configuration);

            const sillabe = getSillabe(root, configuration);

            routeServer(sillabe, port, root, configuration);
        });
};
