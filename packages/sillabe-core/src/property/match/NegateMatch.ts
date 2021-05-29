import { IPropertyMatch } from './IPropertyMatch';
import { Property } from '../Property';

export class NegateMatch implements IPropertyMatch {
    constructor(private readonly propertyMatch: IPropertyMatch) {}

    match(property: Property): boolean {
        return !this.propertyMatch.match(property);
    }
}
