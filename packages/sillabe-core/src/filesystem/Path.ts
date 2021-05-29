import { join, normalize } from 'path';
import { Segment } from '../url/Segment';

export class Path implements Path {
    constructor(private readonly path: string) {
        this.path = path.length === 0 ? '' : normalize(path);
    }

    getPath(prefix?: Path): string {
        if (prefix === undefined) {
            return this.path;
        }

        return new Path(join(prefix.getPath(), this.path)).getPath();
    }

    appendSegment(segment: string): Path {
        return new Path(join(this.path, segment));
    }

    removeLastSegment(): Path {
        const newPathString = this.path.split('/').slice(0, -1).join('/');

        return new Path(newPathString);
    }

    join(path: Path): Path {
        return new Path(path.getPath(this));
    }

    getLastSegment(): Segment | null {
        const segments = this.path.split('/').filter((part) => part.length > 0);

        if (segments.length === 0) {
            return null;
        }

        return new Segment(segments[segments.length - 1]);
    }

    toString(): string {
        return this.path;
    }
}
