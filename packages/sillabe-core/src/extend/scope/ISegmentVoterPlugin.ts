import { PluginScope } from './PluginScope';
import { IPlugin } from '../IPlugin';
import { Segment } from '../../url/Segment';

export interface ISegmentVoterPlugin extends IPlugin {
    vote(segment: Segment): Segment;
}

export const isSegmentVoterPlugin = (object: IPlugin): object is ISegmentVoterPlugin => {
    return object.hasScope(PluginScope.SegmentVoterPlugin) && 'vote' in object;
};
