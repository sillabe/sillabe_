import { IPropertyMatch } from './IPropertyMatch';
import { Property } from '../Property';

export class ValueMatchesRegex implements IPropertyMatch {
    constructor(private readonly name: string, private readonly regex: string | RegExp) {}

    match(property: Property): boolean {
        const value = property.getValue();

        if (typeof value !== 'string') {
            return false;
        }

        return property.getName() === this.name && value.match(this.regex) !== null;
    }
}
