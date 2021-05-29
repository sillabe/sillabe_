import { IPlugin } from '../IPlugin';
import { PluginHolder } from '../PluginHolder';

class ExamplePlugin implements IPlugin {
    getId(): string {
        return 'example';
    }

    hasScope(): boolean {
        return true;
    }
}

describe('PluginHolder', () => {
    const pluginHolder = new PluginHolder();
    const plugin = new ExamplePlugin();

    it('should add plugins', () => {
        pluginHolder.addPlugin(plugin);

        expect(pluginHolder.getPlugin('invalid-id')).toBeNull();
        expect(pluginHolder.hasPlugin('example')).toBeTruthy();
        expect(pluginHolder.getPlugin('example')).toBe(plugin);
        expect(pluginHolder.getPlugins((plugin: IPlugin): plugin is IPlugin => true)).toEqual([plugin]);

        pluginHolder.removePlugin('example');
        pluginHolder.removePlugin('should-not-break');

        expect(pluginHolder.hasPlugin('example')).toBeFalsy();
    });
});
