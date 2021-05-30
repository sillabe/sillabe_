import { PluginScope } from './PluginScope';
import { PostEnhancement } from './PostEnhancement';
import { IPlugin } from '../IPlugin';
import { Post } from '../../node/Post';

export interface IPostEnhancerPlugin extends IPlugin {
    enhance(node: Post, currentEnhancement: PostEnhancement): PostEnhancement;
}

export const isPostEnhancerPlugin = (object: IPlugin): object is IPostEnhancerPlugin => {
    return object.hasScope(PluginScope.PostEnhancerPlugin) && 'enhance' in object;
};
