import { PluginScope } from './scope/PluginScope';

export interface IPlugin {
    getId(): string;

    hasScope(scope: PluginScope): boolean;
}
