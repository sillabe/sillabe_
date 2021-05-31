import { Option, program } from 'commander';
import { createAction, availableTemplateNames } from './createAction';

export const installCreateCommand = () => {
    program
        .command('create [name]')
        .description('Create a new sillabe site')
        .addOption(new Option('-t, --template <template>', 'Template to use').choices(availableTemplateNames))
        .option('-y, --yes', 'Do not ask for confirmation')
        .action(createAction);
};
