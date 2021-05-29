import { readFileSync } from 'fs';
import { basename, extname } from 'path';
import { lookup } from 'mime-types';
import { injectable } from 'tsyringe';
import { Post } from './Post';
import { Attachment } from './Attachment';
import { Property } from '../property/Property';
import { PathValidator } from '../filesystem/PathValidator';
import { NodeFinder } from '../finder/NodeFinder';
import { Url } from '../url/Url';
import { Path } from '../filesystem/Path';

@injectable()
export class NodeProvider implements NodeProvider {
    constructor(private readonly pathValidator: PathValidator) {}

    // todo: here and in provideAttachment, location can be derived from url
    providePost(url: Url, location: Path, dynamic: boolean, nodeFinder: NodeFinder): Post {
        if (!dynamic) {
            this.pathValidator.validateDirectory(location);
        }

        // todo here it would be a good place to call plugins for params
        return new Post(url, location, dynamic, [], nodeFinder);
    }

    provideAttachment(url: Url, location: Path, dynamic: boolean, nodeFinder: NodeFinder): Attachment {
        if (!dynamic) {
            this.pathValidator.validateFile(location);
        }

        const path = location.getPath();

        const extension = extname(path).slice(1);
        const mimeType = lookup(path) || 'text/plain';
        const filename = basename(path, `.${extension}`);
        const nodeBasename = basename(path);

        // todo here it would be a good place to call plugins for params
        return new Attachment(
            url,
            location,
            dynamic,
            [
                new Property('filename', filename),
                new Property('basename', nodeBasename),
                new Property('extension', extension),
                new Property('type', mimeType),
                ...(dynamic ? [] : [new Property('contents', readFileSync(path))]),
            ],
            nodeFinder,
        );
    }
}
