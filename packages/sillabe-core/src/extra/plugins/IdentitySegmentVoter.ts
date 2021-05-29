import { ISegmentVoterPlugin } from '../../extend/scope/ISegmentVoterPlugin';
import { PluginScope } from '../../extend/scope/PluginScope';
import { Segment } from '../../url/Segment';

export class IdentitySegmentVoter implements ISegmentVoterPlugin {
    getId(): string {
        return 'identity-segment-voter';
    }

    hasScope(scope: PluginScope): boolean {
        return scope === PluginScope.SegmentVoterPlugin;
    }

    vote(segment: Segment): Segment {
        return segment;
    }
}
