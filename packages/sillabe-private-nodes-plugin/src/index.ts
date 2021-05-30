import { IPostEnhancerPlugin, PluginScope, Post, PostEnhancement, Resolution, ResolutionState } from '@sillabe/core';

export class PrivateNodesPlugin implements IPostEnhancerPlugin {
    getId(): string {
        return '@sillabe/private-nodes';
    }

    hasScope(scope: PluginScope): boolean {
        return [PluginScope.AttachmentEnhancerPlugin, PluginScope.PostEnhancerPlugin].includes(scope);
    }

    enhance(node: Post, currentEnhancement: PostEnhancement): PostEnhancement {
        if (currentEnhancement.resolve().getState() !== ResolutionState.Found) {
            return currentEnhancement;
        }

        const lastSegment = node.getUrl().getLastSegment();

        if (lastSegment === null) {
            return currentEnhancement;
        }

        if (lastSegment.getSegment().slice(0, 2) === '__') {
            return currentEnhancement.withResolution(new Resolution(ResolutionState.NotFound));
        }

        if (lastSegment.getSegment().slice(0, 1) === '_') {
            return currentEnhancement.withResolution(new Resolution(ResolutionState.NotFoundSelf));
        }

        return currentEnhancement;
    }
}
