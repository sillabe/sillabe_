import { Resolution } from '../../finder/resolution/Resolution';

export abstract class NodeEnhancement {
    constructor(protected readonly resolution: Resolution) {}

    resolve(): Resolution {
        return this.resolution;
    }

    withResolution(resolution: Resolution): NodeEnhancement {
        return new (this.constructor as { new (resolution: Resolution): NodeEnhancement })(resolution);
    }
}
