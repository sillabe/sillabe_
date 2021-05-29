import { IPropertyMatch } from './IPropertyMatch';
import { PropertyHolder } from '../PropertyHolder';

export interface IPropertyHolderAwareMatch extends IPropertyMatch {
    setPropertyHolder(propertyHolder: PropertyHolder): void;
}
