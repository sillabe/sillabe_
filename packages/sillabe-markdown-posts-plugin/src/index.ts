import unified, { Plugin } from 'unified';
import parse from 'remark-parse';
import stringify from 'remark-stringify';
import frontmatter from 'remark-frontmatter';
import html from 'remark-html';
import filter from 'unist-util-filter';
import toml from '@iarna/toml';
import yaml from 'yaml';
import { Node as UnistNode } from 'unist';
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

export enum Formats {
    TOML = 'toml',
    YAML = 'yaml',
}

export class MarkdownPostsPlugin implements IPostEnhancerPlugin, IAttachmentEnhancerPlugin {
    private contentAttachmentUrls: Url[] = [];

    constructor(private readonly supportedFormats: Formats[] = [Formats.TOML, Formats.YAML]) {}

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

        if (post.isDynamic() && !post.propertyExists('_markdown-source')) {
            return currentEnhancement;
        }

        const attachments = post
            .getAttachments()
            .whereProperty(new PropertyIsEqual(new Property('extension', 'md')))
            .whereProperty(new ValueMatchesRegex('filename', /(index|content|post|doc|document)/));

        const firstDocument = attachments.first();

        if (firstDocument === null) {
            return currentEnhancement;
        }

        const markdownSourceProperty = firstDocument.getProperty('contents', '');
        const markdownSource = markdownSourceProperty.getValue();

        if (markdownSource === '') {
            return currentEnhancement;
        }

        const getFrontmatterFilter = (include: boolean) => {
            return () => {
                return (tree: UnistNode) =>
                    filter(tree, (node: any): node is UnistNode => {
                        if (include) {
                            return node.type === 'root' || this.supportedFormats.includes(node.type);
                        }

                        return !this.supportedFormats.includes(node.type);
                    });
            };
        };

        const getDocument = () => unified().use(parse).use(stringify).use(frontmatter, ['yaml', 'toml']);
        const frontmatterResult = getDocument()
            .use(getFrontmatterFilter(true) as Plugin)
            .processSync(markdownSource);
        const textResult = getDocument()
            .use(getFrontmatterFilter(false) as Plugin)
            .processSync(markdownSource);
        const htmlResult = getDocument().use(html).processSync(markdownSource);

        const textSource = textResult.contents.toString().trim();
        const frontmatterSource = frontmatterResult.contents.toString().trim();
        let data: { [key: string]: any } | undefined;

        post.setProperty(new Property('markdown', textSource));
        post.setProperty(new Property('markdown-content', htmlResult));
        this.contentAttachmentUrls.push(firstDocument.getUrl());

        if (frontmatterSource.slice(0, 3) === '+++') {
            data = toml.parse(frontmatterSource.slice(3, -3));
        }

        if (frontmatterSource.slice(0, 3) === '---') {
            data = yaml.parse(frontmatterSource.slice(3, -3));
        }

        if (typeof data === 'undefined') {
            return currentEnhancement;
        }

        const realData = data;

        Object.keys(realData).forEach((key: string) => {
            const value = realData[key];

            post.setProperty(new Property(key, value));
        });

        return currentEnhancement;
    }
}

export default MarkdownPostsPlugin;
