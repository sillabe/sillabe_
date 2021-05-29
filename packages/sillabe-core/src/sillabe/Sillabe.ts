import { container, inject, injectable } from 'tsyringe';
import { Attachment } from '../node/Attachment';
import { IdentitySegmentVoter } from '../extra/plugins/IdentitySegmentVoter';
import { Url } from '../url/Url';
import { PathValidator } from '../filesystem/PathValidator';
import { NodeFinder } from '../finder/NodeFinder';
import { PluginHolder } from '../extend/PluginHolder';
import { Path } from '../filesystem/Path';
import { Post } from '../node/Post';
import { TYPES } from '../types';
import { NodeProvider } from '../node/NodeProvider';

@injectable()
export class Sillabe {
    constructor(
        @inject(TYPES.RootDirectory) private readonly rootDirectory: Path,
        private readonly pathValidator: PathValidator,
        private readonly nodeFinder: NodeFinder,
        private readonly pluginHolder: PluginHolder,
    ) {
        this.pathValidator.validateDirectory(this.getRootDirectory());

        this.pluginHolder.addPlugin(new IdentitySegmentVoter());
    }

    getRootDirectory(): Path {
        return this.rootDirectory;
    }

    get(url: string | Url): Post | Attachment | null {
        let nodeUrl;

        if (typeof url === 'string') {
            nodeUrl = new Url(url);
        } else {
            nodeUrl = url;
        }

        return this.nodeFinder.findNodeAtUrl(nodeUrl);
    }

    getPluginHolder(): PluginHolder {
        return this.pluginHolder;
    }

    static createFromPath(path: string): Sillabe {
        const newContainer = container.createChildContainer();
        newContainer.register<Path>(TYPES.RootDirectory, { useValue: new Path(path) });
        newContainer.register<NodeFinder>(NodeFinder, { useClass: NodeFinder });
        newContainer.register<NodeProvider>(NodeProvider, { useClass: NodeProvider });
        newContainer.register<PathValidator>(PathValidator, { useClass: PathValidator });
        newContainer.registerSingleton<PluginHolder>(PluginHolder);
        newContainer.registerSingleton<Sillabe>(Sillabe);

        return newContainer.resolve(Sillabe);
    }
}
