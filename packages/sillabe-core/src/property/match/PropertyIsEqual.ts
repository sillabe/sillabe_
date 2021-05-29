import { IPropertyMatch } from './IPropertyMatch';
import { Property } from '../Property';

export class PropertyIsEqual implements IPropertyMatch {
    constructor(private readonly property: Property) {}

    match(property: Property): boolean {
        return property.is(this.property);
    }
}
