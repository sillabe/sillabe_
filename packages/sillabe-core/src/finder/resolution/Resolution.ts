import { ResolutionState } from './ResolutionState';

export class Resolution {
    constructor(private readonly resolution: ResolutionState) {}

    getState(): ResolutionState {
        return this.resolution;
    }
}
