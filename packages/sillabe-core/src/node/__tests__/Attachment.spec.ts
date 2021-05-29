import { join } from 'path';
import { PluginHolder } from '../../extend/PluginHolder';
import { PathValidator } from '../../filesystem/PathValidator';
import { Attachment } from '../Attachment';
import { NodeProvider } from '../NodeProvider';
import { NodeFinder } from '../../finder/NodeFinder';
import { Property } from '../../property/Property';
import { Path } from '../../filesystem/Path';
import { Url } from '../../url/Url';

describe('Attachment', () => {
    const rootDirectory = new Path(join(__dirname, 'root'));
    const pathValidator = new PathValidator(rootDirectory);
    const nodeProvider = new NodeProvider(pathValidator);
    const pluginHolder = new PluginHolder();
    const nodeFinder = new NodeFinder(rootDirectory, pathValidator, nodeProvider, pluginHolder);

    it('should create an attachment', () => {
        const attachmentWithoutProperty = new Attachment(
            new Url('folder/file.txt'),
            new Path('root/folder/file.txt'),
            false,
            [],
            nodeFinder,
        );
        const attachment = new Attachment(
            new Url('folder/file.txt'),
            new Path('root/folder/file.txt'),
            false,
            [new Property('extension', 'txt')],
            nodeFinder,
        );

        expect(attachmentWithoutProperty.getProperty('extension').getValue()).toBeNull();
        expect(attachment.getProperty('extension').getValue()).toBe('txt');
    });
});
