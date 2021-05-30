import { join } from 'path';
import { Path, PathValidator, NodeProvider, PluginHolder, NodeFinder, Url } from '@sillabe/core';
import { FilesystemSortingPlugin } from '../index';

describe('filesystem-sorting-plugin', () => {
    const rootDirectory = new Path(join(__dirname, 'root'));
    const pathValidator = new PathValidator(rootDirectory);
    const nodeProvider = new NodeProvider(pathValidator);
    const pluginHolder = new PluginHolder();
    const nodeFinder = new NodeFinder(rootDirectory, pathValidator, nodeProvider, pluginHolder);

    pluginHolder.addPlugin(new FilesystemSortingPlugin());

    it('should ignore numbers in the beginning of the folder name', () => {
        const post = nodeFinder.findPostAtUrl(new Url('/folderWithNumber'));

        expect(post !== null).toBeTruthy();
        expect(post?.getUrl().getUrl()).toBe('/folderWithNumber');
        expect(post?.getPath().getPath()).toBe(join(__dirname, 'root/1. folderWithNumber'));
    });
});
