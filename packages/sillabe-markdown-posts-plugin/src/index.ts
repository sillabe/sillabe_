import toml from '@iarna/toml';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';
import {
    IPostEnhancerPlugin,
    IAttachmentEnhancerPlugin,
    PluginScope,
    PropertyIsEqual,
    ValueMatchesRegex,
    Property,
    Node,
    Url,
    NodeEnhancement,
    Post,
} from '@sillabe/core';

export class MarkdownPostsPlugin implements IPostEnhancerPlugin, IAttachmentEnhancerPlugin {
    private contentAttachmentUrls: Url[] = [];

    getId(): string {
        return 'markdown-posts';
    }

    hasScope(scope: PluginScope): boolean {
        return [PluginScope.PostEnhancerPlugin, PluginScope.AttachmentEnhancerPlugin].includes(scope);
    }

    enhance(node: Node, currentEnhancement: NodeEnhancement): NodeEnhancement {
        if (Node.isAttachment(node)) {
            if (typeof this.contentAttachmentUrls.find((url) => url.is(node.getUrl())) !== 'undefined') {
                node.setProperty(new Property('--content-attachment', true));
            }

            return currentEnhancement;
        }

        const post = node as Post;

        const attachments = post
            .getAttachments()
            .whereProperty(new PropertyIsEqual(new Property('extension', 'md')))
            .whereProperty(new ValueMatchesRegex('filename', /(index|content|post|doc|document)/));

        const firstDocument = attachments.first();

        if (firstDocument === null) {
            return currentEnhancement;
        }

        const markdownSourceProperty = firstDocument.getProperty('contents', '');
        const markdownCompleteSource = markdownSourceProperty.getValue();

        if (markdownCompleteSource === '') {
            return currentEnhancement;
        }

        const { content, data } = matter(markdownCompleteSource.toString(), {
            engines: {
                toml: toml.parse.bind(toml),
            },
        });
        const unsafeRender = new MarkdownIt('commonmark').render(content);

        post.setProperty(new Property('markdown-source', content));
        post.setProperty(new Property('markdown', sanitizeHtml(unsafeRender)));

        this.contentAttachmentUrls.push(firstDocument.getUrl());

        Object.keys(data).forEach((key: string) => {
            const value = data[key];

            post.setProperty(new Property(key, value));
        });

        return currentEnhancement;
    }
}
