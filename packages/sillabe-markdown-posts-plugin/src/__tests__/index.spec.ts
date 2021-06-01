import { join } from 'path';
import { Sillabe, Node } from '@sillabe/core';
import { MarkdownPostsPlugin } from '../index';

describe('MarkdownPosts', () => {
    const sillabe = Sillabe.createFromPath(join(__dirname, 'root'));
    const plugin = new MarkdownPostsPlugin();
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
        expect(root?.getProperty('markdown-source', '').getValue()).toBe('Some markdown *content*.\n');
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
        expect(post?.getProperty('markdown-source', '').getValue()).toBe('Normal *contents*.\n');
    });
});
