import { join } from 'path';
import { Sillabe } from '../Sillabe';
import { PluginHolder } from '../../extend/PluginHolder';
import { PathValidator } from '../../filesystem/PathValidator';
import { NodeProvider } from '../../node/NodeProvider';
import { NodeFinder } from '../../finder/NodeFinder';
import { Path } from '../../filesystem/Path';
import { InvalidPath } from '../../error/InvalidPath';
import { Url } from '../../url/Url';
import { NodeType } from '../../node/NodeType';

const invalidPath = 'hello';

describe('Sillabe', () => {
    const sillabe = Sillabe.createFromPath(join(__dirname, 'root', 'empty'));
    const otherSillabe = Sillabe.createFromPath(join(__dirname, 'root', 'full'));

    const rootDirectory = new Path(join(__dirname, 'root'));
    const pathValidator = new PathValidator(rootDirectory);
    const nodeProvider = new NodeProvider(pathValidator);
    const pluginHolder = new PluginHolder();
    const nodeFinder = new NodeFinder(rootDirectory, pathValidator, nodeProvider, pluginHolder);

    it('should create a sillabe instance', () => {
        const sillabeInstance = new Sillabe(rootDirectory, pathValidator, nodeFinder, pluginHolder);
        expect(sillabeInstance.getRootDirectory()).toEqual(rootDirectory);
    });

    it('should throw on invalid paths', () => {
        const instanceCreation = () => {
            Sillabe.createFromPath(invalidPath);
        };
        expect(instanceCreation).toThrowError(new InvalidPath(new Path(invalidPath)));
    });

    it('should create an instance for valid paths', () => {
        expect(sillabe.getRootDirectory().getPath()).toBe(join(__dirname, 'root', 'empty'));
        expect(otherSillabe.getRootDirectory().getPath()).toBe(join(__dirname, 'root', 'full'));
    });

    it('should get nodes', () => {
        const post = sillabe.get('/');
        const notFound = sillabe.get(new Url('/nothing'));
        const file = otherSillabe.get('/some-file.txt');

        expect(post === null).toBeFalsy();
        expect(post?.getNodeType()).toBe(NodeType.Post);
        expect(notFound).toBeNull();
        expect(file?.getNodeType()).toBe(NodeType.Attachment);
    });
});
