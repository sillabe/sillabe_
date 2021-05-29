import { join } from 'path';
import { Path } from '../Path';
import { PathValidator } from '../PathValidator';
import { InvalidPath } from '../../error/InvalidPath';

describe('PathValidator', () => {
    const rootPath = new Path(join(__dirname, 'root/path'));
    const pathValidator = new PathValidator(rootPath);
    const badPath = new Path(join(__dirname, 'other/path'));
    const directory = new Path(join(__dirname, 'root/path/directory'));
    const file = new Path(join(__dirname, 'root/path/directory/file.txt'));

    it('should only allow paths inside the root directory', () => {
        expect(pathValidator.isValid(directory)).toBeTruthy();
        expect(pathValidator.isValid(new Path(join(__dirname, 'root/path/directory')))).toBeTruthy();
        expect(pathValidator.isValid(new Path('/'))).toBeFalsy();
        expect(pathValidator.isValid(badPath)).toBeFalsy();

        expect(() => {
            pathValidator.validatePath(badPath);
        }).toThrowError(new InvalidPath(badPath));
    });

    it('should only allow existing paths', () => {
        expect(pathValidator.isValid(new Path(join(__dirname, 'root/path/directory/file.txt')))).toBeTruthy();
        expect(pathValidator.isValid(new Path(join(__dirname, 'root/path/directory/not-found')))).toBeFalsy();
    });

    it('should validate files', () => {
        expect(pathValidator.isFile(file)).toBeTruthy();
        expect(() => {
            pathValidator.validateFile(directory);
        }).toThrowError(new InvalidPath(directory));
    });

    it('should validate directories', () => {
        expect(pathValidator.isDirectory(directory)).toBeTruthy();
        expect(() => {
            pathValidator.validateDirectory(file);
        }).toThrowError(new InvalidPath(file));
    });
});
