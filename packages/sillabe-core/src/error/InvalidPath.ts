import { Path } from '../filesystem/Path';

export class InvalidPath extends Error {
    /* istanbul ignore next */
    constructor(path: Path) {
        super(`Path "${path.getPath()}" is not valid.`);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
