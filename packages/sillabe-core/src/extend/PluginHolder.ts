import { singleton } from 'tsyringe';
import { PluginsObject } from './PluginsObject';
import { IPlugin } from './IPlugin';

@singleton()
export class PluginHolder {
    private readonly plugins: PluginsObject = {};

    addPlugin(plugin: IPlugin): void {
        this.plugins[plugin.getId()] = plugin;
    }

    removePlugin(id: string): void {
        if (!this.hasPlugin(id)) {
            return;
        }

        delete this.plugins[id];
    }

    getPlugin(id: string): IPlugin | null {
        if (!this.hasPlugin(id)) {
            return null;
        }

        return this.plugins[id];
    }

    hasPlugin(id: string): boolean {
        return this.plugins.hasOwnProperty(id);
    }

    getPlugins<T extends IPlugin>(filter: (plugin: IPlugin) => plugin is T): T[] {
        return Object.values(this.plugins).filter(filter);
    }
}
