import { PluginScope } from './PluginScope';
import { DynamicPost } from '../../node/DynamicPost';
import { Post } from '../../node/Post';
import { DynamicAttachment } from '../../node/DynamicAttachment';
import { IPlugin } from '../IPlugin';

export interface IDynamicNodePlugin extends IPlugin {
    getChildrenOfPost(post: Post): DynamicPost[];

    getAttachmentsOfPost(post: Post): DynamicAttachment[];
}

export const isDynamicNodePlugin = (object: IPlugin): object is IDynamicNodePlugin => {
    return (
        object.hasScope(PluginScope.DynamicNodePlugin) &&
        'getChildrenOfPost' in object &&
        'getAttachmentsOfPost' in object
    );
};
