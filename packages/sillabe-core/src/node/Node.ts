import { Post } from './Post';
import { NodeType } from './NodeType';
import { Attachment } from './Attachment';
import { PropertyHolder } from '../property/PropertyHolder';
import { Property } from '../property/Property';
import { Url } from '../url/Url';
import { Path } from '../filesystem/Path';

export abstract class Node extends PropertyHolder implements Node {
    /* istanbul ignore next */
    constructor(
        protected readonly _url: Url,
        protected readonly _path: Path,
        private readonly _dynamic: boolean,
        properties: Property[] = [],
    ) {
        super(properties);
    }

    getUrl(): Url {
        return this._url;
    }

    get url(): string {
        return this._url.toString();
    }

    getPath(): Path {
        return this._path;
    }

    get path(): string {
        return this._path.toString();
    }

    is(node: Node): boolean {
        return this.getPath().getPath() === node.getPath().getPath();
    }

    isDynamic(): boolean {
        return this._dynamic;
    }

    abstract getNodeType(): NodeType;

    static isPost(node: Node): node is Post {
        return node.getNodeType() === NodeType.Post;
    }

    static isAttachment(node: Node): node is Attachment {
        return node.getNodeType() === NodeType.Attachment;
    }
}
