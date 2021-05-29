import { join } from 'path';
import { MarkdownPosts } from '../MarkdownPosts';
import { Node } from '../../../node/Node';
import { Sillabe } from '../../../sillabe/Sillabe';

describe('MarkdownPosts', () => {
    const sillabe = Sillabe.createFromPath(join(__dirname, 'root'));
    const plugin = new MarkdownPosts();
    sillabe.getPluginHolder().addPlugin(plugin);
    const root = sillabe.get('/');
    const post = sillabe.get('/post');
    const attachment = sillabe.get('/index.md');

    it('should set --content-attachment property', () => {
        expect(attachment?.prop('--content-attachment', false)).toBeTruthy();
    });

    it('should handle files with frontmatter', () => {
        expect(root?.getProperty('title', '').getValue()).toBe('Some title');
        expect(root?.getProperty('date', null).getValue()).toEqual(new Date('2020-01-25'));
        expect(root?.getProperty('markdown', '').getValue()).toBe('Some markdown _content_.');
        expect(root?.getProperty('post', {}).getValue()).toEqual({
            category: 'blog',
            published: false,
        });
        expect(attachment?.getProperty('--content-attachment', false).getValue()).toBeTruthy();

        if (root !== null && Node.isPost(root)) {
            expect(root.getAttachments().first()?.getProperty('--content-attachment', false).getValue()).toBeTruthy();
        }
    });

    it('should handle files without frontmatter', () => {
        expect(post?.getProperty('title', '').getValue()).toBe('');
        expect(post?.getProperty('markdown', '').getValue()).toBe('Normal _contents_.');
    });
});
