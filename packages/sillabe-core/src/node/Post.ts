import { NodeType } from './NodeType';
import { PostList } from './PostList';
import { Node } from './Node';
import { AttachmentList } from './AttachmentList';
import { Attachment } from './Attachment';
import { Property } from '../property/Property';
import { NodeFinder } from '../finder/NodeFinder';
import { Url } from '../url/Url';
import { Path } from '../filesystem/Path';

export class Post extends Node implements Post {
    constructor(
        url: Url,
        path: Path,
        dynamic: boolean,
        properties: Property[],
        private readonly nodeFinder: NodeFinder,
    ) {
        super(url, path, dynamic, properties);
    }

    getAttachments(): AttachmentList {
        return this.nodeFinder.findAttachmentsAt(this);
    }

    get attachments(): Attachment[] {
        return this.getAttachments().toArray();
    }

    hasAttachment(attachment: Attachment): boolean {
        return attachment.getPost().is(this);
    }

    isParentOf(node: Post): boolean {
        return node.getParent()?.is(this) ?? false;
    }

    isChildOf(node: Post): boolean {
        return this.getParent()?.is(node) ?? false;
    }

    getChildren(): PostList {
        return this.nodeFinder.findPostsAt(this);
    }

    get children(): Post[] {
        return this.getChildren().toArray();
    }

    getSiblings(): PostList {
        return this.getParent()?.getChildren().except(this) ?? new PostList([]);
    }

    get siblings(): Post[] {
        return this.getSiblings().toArray();
    }

    getParent(): Post | null {
        if (this.isRoot()) {
            return null;
        }

        return this.nodeFinder.findPostAtUrl(this.getUrl().removeLastSegment());
    }

    get parent(): Post | null {
        return this.getParent();
    }

    isRoot(): boolean {
        const rootPost = this.nodeFinder.findRootPost();

        return this.is(rootPost);
    }

    getProtectedNames(): string[] {
        return [];
    }

    getNodeType(): NodeType.Post {
        return NodeType.Post;
    }
}
