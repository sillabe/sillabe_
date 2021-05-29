import { existsSync, lstatSync } from 'fs';
import { isAbsolute, relative } from 'path';
import { inject, injectable } from 'tsyringe';
import { Path } from './Path';
import { TYPES } from '../types';
import { InvalidPath } from '../error/InvalidPath';

@injectable()
export class PathValidator {
    constructor(@inject(TYPES.RootDirectory) private readonly rootDirectory: Path) {}

    validatePath(path: Path): void {
        if (!this.isValid(path)) {
            this.failPath(path);
        }
    }

    validateDirectory(path: Path): void {
        this.validatePath(path);

        if (!this.isDirectory(path)) {
            this.failPath(path);
        }
    }

    validateFile(path: Path): void {
        this.validatePath(path);

        if (!this.isFile(path)) {
            this.failPath(path);
        }
    }

    isValid(path: Path): boolean {
        return existsSync(path.getPath()) && this.isPathUnderRootDirectory(path.getPath());
    }

    isDirectory(path: Path): boolean {
        return lstatSync(path.getPath()).isDirectory();
    }

    isFile(path: Path): boolean {
        return lstatSync(path.getPath()).isFile();
    }

    private isPathUnderRootDirectory(path: string): boolean {
        if (path === this.rootDirectory.getPath()) {
            return true;
        }

        const relativePath = relative(this.rootDirectory.getPath(), path);

        return relativePath.length > 0 && !relativePath.startsWith('..') && !isAbsolute(relativePath);
    }

    private failPath(path: Path): void {
        throw new InvalidPath(path);
    }
}
