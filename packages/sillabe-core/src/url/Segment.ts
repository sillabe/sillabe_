export class Segment {
    constructor(private readonly segment: string) {}

    getSegment(): string {
        return this.segment;
    }

    is(segment: Segment): boolean {
        return segment.getSegment() === this.getSegment();
    }

    toString(): string {
        return this.getSegment();
    }
}
