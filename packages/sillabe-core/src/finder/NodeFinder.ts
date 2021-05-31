import { readdirSync } from 'fs';
import { inject, injectable } from 'tsyringe';
import { ResolutionState } from './resolution/ResolutionState';
import { Resolution } from './resolution/Resolution';
import { IDynamicNodePlugin, isDynamicNodePlugin } from '../extend/scope/IDynamicNodePlugin';
import { PostList } from '../node/PostList';
import { Segment } from '../url/Segment';
import { ISegmentVoterPlugin, isSegmentVoterPlugin } from '../extend/scope/ISegmentVoterPlugin';
import { IAttachmentEnhancerPlugin, isAttachmentEnhancerPlugin } from '../extend/scope/IAttachmentEnhancerPlugin';
import { Post } from '../node/Post';
import { PostEnhancement } from '../extend/scope/PostEnhancement';
import { IPostEnhancerPlugin, isPostEnhancerPlugin } from '../extend/scope/IPostEnhancerPlugin';
import { AttachmentList } from '../node/AttachmentList';
import { Url } from '../url/Url';
import { Node } from '../node/Node';
import { Path } from '../filesystem/Path';
import { PathValidator } from '../filesystem/PathValidator';
import { NodeProvider } from '../node/NodeProvider';
import { PluginHolder } from '../extend/PluginHolder';
import { Attachment } from '../node/Attachment';
import { DynamicAttachment } from '../node/DynamicAttachment';
import { DynamicPost } from '../node/DynamicPost';
import { AttachmentEnhancement } from '../extend/scope/AttachmentEnhancement';
import { TYPES } from '../types';

@injectable()
export class NodeFinder {
    constructor(
        @inject(TYPES.RootDirectory) private readonly rootDirectory: Path,
        private readonly pathValidator: PathValidator,
        private readonly nodeProvider: NodeProvider,
        private readonly pluginHolder: PluginHolder,
    ) {}

    findRootPost(): Post {
        return this.findPostAtUrl(new Url('/')) as Post;
    }

    findPostsAt(post: Post, includeSelfNotFound: boolean = false): PostList {
        const realChildren = this.findRealPostsAt(post);
        const dynamicChildren = this.findDynamicPostsAt(post);
        const allChildren = [...realChildren, ...dynamicChildren].filter((child) => {
            const enhancement = this.enhancePost(child);
            const state = enhancement.resolve().getState();

            return [ResolutionState.Found, ...(includeSelfNotFound ? [ResolutionState.NotFoundSelf] : [])].includes(
                state,
            );
        });

        return new PostList(allChildren);
    }

    private findRealPostsAt(post: Post): Post[] {
        if (post.isDynamic()) {
            return [];
        }

        const directories = this.findFilesAndDirectoriesAt(post.getPath()).filter(
            this.pathValidator.isDirectory.bind(this.pathValidator),
        );

        return directories.map((directory) => {
            const lastSegment = directory.getLastSegment();
            const newSegment = lastSegment === null ? new Segment('') : this.processSegment(lastSegment);

            return this.nodeProvider.providePost(post.getUrl().appendSegment(newSegment), directory, false, this);
        });
    }

    private findDynamicPostsAt(post: Post): Post[] {
        const dynamicNodeProviders = this.pluginHolder.getPlugins<IDynamicNodePlugin>(isDynamicNodePlugin);
        const dynamicPosts = dynamicNodeProviders.reduce((previous: DynamicPost[], current: IDynamicNodePlugin) => {
            return [...previous, ...current.getChildrenOfPost(post)];
        }, [] as DynamicPost[]);

        return dynamicPosts.map((dynamicPost) =>
            this.nodeProvider.providePost(
                post.getUrl().appendSegment(this.processSegment(dynamicPost.getSegment())),
                post.getPath().appendSegment(dynamicPost.getSegment().getSegment()), // todo: change appendSegment so that it can accept ISegment
                true,
                this,
            ),
        );
    }

    findAttachmentsAt(post: Post): AttachmentList {
        const dynamicAttachments = this.findDynamicAttachmentsAt(post);
        const realAttachments = this.findRealAttachmentsAt(post);
        const allAttachments = [...realAttachments, ...dynamicAttachments].filter((attachment) => {
            const enhancement = this.enhanceAttachment(attachment);
            const state = enhancement.resolve().getState();

            return state === ResolutionState.Found;
        });

        return new AttachmentList(allAttachments);
    }

    private findRealAttachmentsAt(post: Post): Attachment[] {
        if (post.isDynamic()) {
            return [];
        }

        const files = this.findFilesAndDirectoriesAt(post.getPath()).filter(
            this.pathValidator.isFile.bind(this.pathValidator),
        );

        return files.map((file) => {
            const lastSegment = file.getLastSegment();
            const newSegment = lastSegment === null ? new Segment('') : this.processSegment(lastSegment);

            return this.nodeProvider.provideAttachment(post.getUrl().appendSegment(newSegment), file, false, this);
        });
    }

    private findDynamicAttachmentsAt(post: Post): Attachment[] {
        const dynamicNodeProviders = this.pluginHolder.getPlugins<IDynamicNodePlugin>(isDynamicNodePlugin);
        const dynamicAttachments = dynamicNodeProviders.reduce(
            (previous: DynamicAttachment[], current: IDynamicNodePlugin) => {
                return [...previous, ...current.getAttachmentsOfPost(post)];
            },
            [] as DynamicAttachment[],
        );

        return dynamicAttachments.map((dynamicAttachment) =>
            this.nodeProvider.provideAttachment(
                post.getUrl().appendSegment(this.processSegment(dynamicAttachment.getSegment())),
                post.getPath().appendSegment(dynamicAttachment.getSegment().getSegment()), // todo: change appendSegment so that it can accept ISegment
                true,
                this,
            ),
        );
    }

    private recursivelyFindNodeAtUrl(url: Url, isLeaf: boolean): Post | Attachment | null {
        let node: Node | undefined;

        if (!url.hasParent()) {
            node = this.nodeProvider.providePost(new Url('/'), this.rootDirectory, false, this);
        } else {
            const parent = this.recursivelyFindNodeAtUrl(url.removeLastSegment(), false);

            if (parent === null) {
                return null;
            }

            if (!Post.isPost(parent)) {
                return null;
            }

            const children = this.findPostsAt(parent, true);
            const attachments = parent.getAttachments();
            const nodes = [...children.toArray(), ...attachments.toArray()];
            node = nodes.find((node) => {
                const lastSegment = node.getUrl().getLastSegment();

                if (lastSegment === null) {
                    return false;
                }

                return url.getLastSegment()?.is(lastSegment) ?? false;
            });
        }

        if (typeof node === 'undefined') {
            return null;
        }

        if (Node.isPost(node)) {
            const newEnhancement = this.enhancePost(node);
            const currentState = newEnhancement.resolve().getState();

            if (currentState === ResolutionState.NotFound) {
                return null;
            }

            if (currentState === ResolutionState.NotFoundSelf && isLeaf) {
                return null;
            }

            return node;
        }

        if (Node.isAttachment(node)) {
            const newEnhancement = this.enhanceAttachment(node);
            const currentState = newEnhancement.resolve().getState();

            if (currentState !== ResolutionState.Found) {
                return null;
            }

            return node;
        }

        return null;
    }

    findNodeAtUrl(url: Url): Post | Attachment | null {
        return this.recursivelyFindNodeAtUrl(url, true);
    }

    findPostAtUrl(url: Url): Post | null {
        const node = this.findNodeAtUrl(url);

        if (node === null || !Node.isPost(node)) {
            return null;
        }

        return node;
    }

    findAttachmentAtUrl(url: Url): Attachment | null {
        const node = this.findNodeAtUrl(url);

        if (node === null || !Node.isAttachment(node)) {
            return null;
        }

        return node;
    }

    private enhancePost(post: Post): PostEnhancement {
        const defaultPostEnhancement = new PostEnhancement(new Resolution(ResolutionState.Found));
        const postEnhancers = this.pluginHolder.getPlugins<IPostEnhancerPlugin>(isPostEnhancerPlugin);

        return postEnhancers.reduce<PostEnhancement>(
            (previousEnhancement, currentPlugin) => currentPlugin.enhance(post, previousEnhancement),
            defaultPostEnhancement,
        );
    }

    private enhanceAttachment(attachment: Attachment): AttachmentEnhancement {
        const defaultAttachmentEnhancement = new AttachmentEnhancement(new Resolution(ResolutionState.Found));
        const attachmentEnhancers = this.pluginHolder.getPlugins<IAttachmentEnhancerPlugin>(isAttachmentEnhancerPlugin);

        return attachmentEnhancers.reduce<AttachmentEnhancement>(
            (previousEnhancement, currentPlugin) => currentPlugin.enhance(attachment, previousEnhancement),
            defaultAttachmentEnhancement,
        );
    }

    private findFilesAndDirectoriesAt(path: Path): Path[] {
        return readdirSync(path.getPath())
            .filter((pathString) => {
                return pathString.slice(0, 1) !== '.';
            })
            .map((pathString) => path.join(new Path(pathString)));
    }

    private processSegment(segment: Segment): Segment {
        const segmentVoters = this.pluginHolder.getPlugins<ISegmentVoterPlugin>(isSegmentVoterPlugin);

        return segmentVoters.reduce((previous, current) => current.vote(previous), segment);
    }
}
