import { existsSync, accessSync, constants } from 'fs';
import { join } from 'path';
import { ConfigurationSchema, Configuration } from '../types';

export const getConfiguration = (absolutePath: string): Configuration => {
    const configPath = join(absolutePath, '.sillaberc.js');

    if (!existsSync(configPath)) {
        throw new Error(`Could not find configuration file ${configPath}`);
    }

    accessSync(configPath, constants.R_OK);

    const configuration = require(configPath);
    const result = ConfigurationSchema.safeParse(configuration);

    if (!result.success) {
        const errors = result.error.issues;

        throw new Error(
            'configuration is not valid.\n' +
                errors.map((error) => `${['config', ...error.path].join('.')}: ${error.message}`).join('\n'),
        );
    }

    return result.data;
};
