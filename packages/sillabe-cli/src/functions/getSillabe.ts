import { join } from 'path';
import { Sillabe } from '@sillabe/core';
import { Configuration } from '../types';

export const getSillabe = (root: string, configuration: Configuration) => {
    const sillabe = Sillabe.createFromPath(join(root, configuration.content));
    const pluginHolder = sillabe.getPluginHolder();

    configuration.plugins.forEach((plugin) => {
        pluginHolder.addPlugin(plugin);
    });

    return sillabe;
};
