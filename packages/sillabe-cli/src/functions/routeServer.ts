import { Express } from 'express';
import { Sillabe, Node } from '@sillabe/core';

export const routeServer = (server: Express, sillabe: Sillabe, port: string) => {
    server.get('*', (req, res) => {
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

        const templateName = node.getProperty('layout').getValue();

        res.render(templateName, { page: node });
    });

    server.listen(port, () => {
        console.log(`Listening at http://localhost:${port}`);
    });
};
