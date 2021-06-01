import commander, { Option, program } from 'commander';
import { createAction, availableTemplateNames } from './createAction';

export const installCreateCommand = () => {
    const command = program.command('create [name]').description('Create a new sillabe site');

    installOptions(command);
};

export const installOptions = (command: commander.Command) => {
    return command
        .addOption(new Option('-t, --template <template>', 'Template to use').choices(availableTemplateNames))
        .option('-y, --yes', 'Do not ask for confirmation')
        .action(createAction);
};
