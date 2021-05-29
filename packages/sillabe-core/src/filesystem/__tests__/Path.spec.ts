import { Path } from '../Path';

describe('Path', () => {
    const emptyPath = new Path('');
    const path = new Path('some/path');

    it('should return a string', () => {
        expect(path.toString()).toBe('some/path');
    });

    it('should give an empty last segment', () => {
        expect(emptyPath.getLastSegment()).toBeNull();
    });

    it('should get the path with a prefix', () => {
        expect(path.getPath(new Path('prefix'))).toBe('prefix/some/path');
    });

    it('should append a segment', () => {
        expect(path.appendSegment('segment').getPath()).toBe('some/path/segment');
    });

    it('should remove last segment', () => {
        expect(path.removeLastSegment().getPath()).toBe('some');
    });
});
