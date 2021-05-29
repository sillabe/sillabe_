import { Property } from '../Property';

export interface IPropertyMatch {
    match(property: Property): boolean;
}
