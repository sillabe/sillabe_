import { join } from 'path';
import express from 'express';
import consolidate from 'consolidate';
import { Node, Sillabe } from '@sillabe/core';
import { supportedTemplateEngines, Configuration } from '../types';

export const routeServer = (sillabe: Sillabe, port: string, root: string, configuration: Configuration) => {
    const server = express();
    const engineExtension = supportedTemplateEngines[configuration.templateEngine];

    server.use(express.static(join(root, configuration.public)));
    server.engine(engineExtension, consolidate[configuration.templateEngine as keyof typeof consolidate] as any);
    server.set('view engine', engineExtension);
    server.set('views', join(root, configuration.views));

    server.get('*', async (req, res) => {
        const url = req.url;
        const node = sillabe.get(url);

        if (node === null) {
            res.status(404).send();

            return;
        }

        if (Node.isAttachment(node)) {
            res.sendFile(node.getPath().getPath());

            return;
        }

        const templateName = node.getProperty('layout', 'default').getValue();

        res.render(`${templateName}.${engineExtension}`, { page: node });
    });

    server.listen(port, () => {
        console.log(`Listening at http://localhost:${port}`);
    });
};
