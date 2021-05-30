import { join } from 'path';
import express from 'express';
import consolidate from 'consolidate';
import { Configuration } from '../types';

export const createServer = (root: string, configuration: Configuration) => {
    const server = express();
    server.engine('engine', consolidate[configuration.templateEngine as keyof typeof consolidate] as any);
    server.set('view engine', 'engine');
    server.set('views', join(root, configuration.views));

    return server;
};
