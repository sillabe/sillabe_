import { Property } from '../property/Property';
import { Segment } from '../url/Segment';

export abstract class DynamicNode {
    constructor(protected readonly segment: Segment, protected readonly properties: Property[]) {}

    getSegment(): Segment {
        return this.segment;
    }

    getProperties(): Property[] {
        return this.properties;
    }
}
