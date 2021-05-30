import { existsSync, lstatSync } from 'fs';
import { join } from 'path';
import { Configuration } from '../types';

export const validateConfiguration = (root: string, configuration: Configuration) => {
    const contentPath = join(root, configuration.content);
    const viewsPath = join(root, configuration.views);

    if (!existsSync(contentPath) || !lstatSync(contentPath).isDirectory()) {
        throw new Error(`Content directory ${contentPath} is not valid`);
    }

    if (!existsSync(viewsPath) || !lstatSync(viewsPath).isDirectory()) {
        throw new Error(`Content directory ${viewsPath} is not valid`);
    }
};
