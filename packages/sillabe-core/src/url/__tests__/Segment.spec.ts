import { Segment } from '../Segment';

describe('segment', () => {
    it('should cast to string', () => {
        expect(new Segment('segment').toString()).toBe('segment');
    });
});
