export class CannotModifyProtectedProperty extends Error {
    /* istanbul ignore next */
    constructor(name: string) {
        super(`Cannot modify protected property "${name}"`);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
