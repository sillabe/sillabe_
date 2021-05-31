import inquirer from 'inquirer';
import { program } from 'commander';
import degit from 'degit';

const availableTemplates = [{ name: 'blank', description: 'Basic template' }];
export const availableTemplateNames = availableTemplates.map((template) => template.name);

export const createAction: Parameters<typeof program.action>[0] = async (name, options) => {
    const namePrompt: inquirer.Question = {
        name: 'name',
        message: 'Site name',
        validate(input) {
            if (input.trim().length === 0) {
                return 'Please provide a name';
            }

            return true;
        },
    };
    const templateChoice: inquirer.ListQuestion = {
        type: 'list',
        name: 'template',
        message: 'Choose a template',
        choices: availableTemplates.map((template) => ({
            name: `${template.name} — ${template.description}`,
            value: template.name,
        })),
    };
    const confirm: inquirer.Question = {
        name: 'confirm',
        type: 'confirm',
        message: (answers) => `Creating site "${answers.name}". Continue?`,
    };

    const results = await inquirer.prompt([namePrompt, templateChoice, confirm], {
        name,
        template: options.template,
        confirm: options.yes,
    });

    if (!results.confirm) {
        return;
    }

    const emitter = degit(`sillabe/template-${results.template}`, {
        verbose: true,
    });

    emitter.on('info', (info) => {
        console.log(info.message);
    });

    await emitter.clone(results.name);

    console.log('Done!');
};
