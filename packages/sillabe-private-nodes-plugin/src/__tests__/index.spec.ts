import { join } from 'path';
import { Path, PathValidator, NodeProvider, PluginHolder, NodeFinder, Url } from '@sillabe/core';
import PrivateNodesPlugin from '../index';

describe('private-nodes-plugin', () => {
    const rootDirectory = new Path(join(__dirname, 'root'));
    const pathValidator = new PathValidator(rootDirectory);
    const nodeProvider = new NodeProvider(pathValidator);
    const pluginHolder = new PluginHolder();
    const nodeFinder = new NodeFinder(rootDirectory, pathValidator, nodeProvider, pluginHolder);

    pluginHolder.addPlugin(new PrivateNodesPlugin());

    it('should hide private nodes', () => {
        const privateAttachment = nodeFinder.findAttachmentAtUrl(new Url('/folderWithFile/_privateFile.txt'));
        const privateDeepAttachment = nodeFinder.findAttachmentAtUrl(
            new Url('/folderWithFile/__privatePath/unreachable.txt'),
        );
        const privatePost = nodeFinder.findPostAtUrl(new Url('/folderWithFile/__privatePath'));
        const otherPrivatePost = nodeFinder.findPostAtUrl(new Url('/folderWithFile/_privatePathWithReachableChild'));
        const publicAttachmentInPrivatePost = nodeFinder.findAttachmentAtUrl(
            new Url('/folderWithFile/_privatePathWithReachableChild/reachable.txt'),
        );

        expect(privateAttachment).toBeNull();
        expect(privateDeepAttachment).toBeNull();
        expect(privatePost).toBeNull();
        expect(otherPrivatePost).toBeNull();
        expect(publicAttachmentInPrivatePost !== null).toBeTruthy();
    });
});
