import { Post } from './Post';
import { NodeType } from './NodeType';
import { Node } from './Node';
import { Property } from '../property/Property';
import { NodeFinder } from '../finder/NodeFinder';
import { Path } from '../filesystem/Path';
import { Url } from '../url/Url';

export class Attachment extends Node {
    /* istanbul ignore next */
    constructor(
        url: Url,
        path: Path,
        dynamic: boolean,
        properties: Property[],
        private readonly nodeFinder: NodeFinder,
    ) {
        super(url, path, dynamic, properties);
    }

    getPost(): Post {
        return this.nodeFinder.findPostAtUrl(this.getUrl().removeLastSegment()) as Post;
    }

    isAttachmentOf(post: Post): boolean {
        return post.getAttachments().contains(this);
    }

    getProtectedNames(): string[] {
        return ['filename', 'basename', 'contents', 'extension', 'type'];
    }

    getNodeType(): NodeType.Attachment {
        return NodeType.Attachment;
    }
}
