import { ISegmentVoterPlugin, PluginScope, Segment } from '@sillabe/core';

export class FilesystemSortingPlugin implements ISegmentVoterPlugin {
    getId(): string {
        return '@sillabe/filesystem-sorting';
    }

    hasScope(scope: PluginScope): boolean {
        return scope === PluginScope.SegmentVoterPlugin;
    }

    vote(segment: Segment): Segment {
        const segmentString = segment.getSegment();
        const matches = segmentString.match(/^\d+\.\s+(.*)$/);

        if (!matches) {
            return segment;
        }

        return new Segment(matches[1]);
    }
}
