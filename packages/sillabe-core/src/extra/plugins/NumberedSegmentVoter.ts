import { ISegmentVoterPlugin } from '../../extend/scope/ISegmentVoterPlugin';
import { PluginScope } from '../../extend/scope/PluginScope';
import { Segment } from '../../url/Segment';

export class NumberedSegmentVoter implements ISegmentVoterPlugin {
    getId(): string {
        return 'numbered-segment-voter';
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
