import { IPropertyMatch } from './IPropertyMatch';
import { Property } from '../Property';

export class PropertyPassesTest implements IPropertyMatch {
    constructor(private readonly callback: (property: Property) => boolean) {}

    match(property: Property): boolean {
        return this.callback(property);
    }
}
