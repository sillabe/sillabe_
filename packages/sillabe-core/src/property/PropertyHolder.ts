import { IPropertyMatch } from './match/IPropertyMatch';
import { PropertyPassesTest } from './match/PropertyPassesTest';
import { IPropertyHolderAwareMatch } from './match/IPropertyHolderAwareMatch';
import { PropertyIsEqual } from './match/PropertyIsEqual';
import { PropertyObject } from './PropertyObject';
import { ValueMatchesRegex } from './match/ValueMatchesRegex';
import { Property } from './Property';
import { CannotModifyProtectedProperty } from '../error/CannotModifyProtectedProperty';

const instanceOfPropertyHolderAwareMatch = (object: IPropertyMatch): object is IPropertyHolderAwareMatch => {
    return 'setPropertyHolder' in object;
};

export abstract class PropertyHolder implements PropertyHolder {
    private readonly properties: PropertyObject = {};

    protected constructor(properties: Property[] = []) {
        properties.forEach(this.setProperty.bind(this));
    }

    propertyExists(name: string): boolean {
        return this.properties.hasOwnProperty(name);
    }

    hasProperty(property: Property): boolean {
        const name = property.getName();

        return this.propertyExists(name) && this.getProperty(name).is(property);
    }

    match(propertyMatch: IPropertyMatch): boolean {
        if (instanceOfPropertyHolderAwareMatch(propertyMatch)) {
            propertyMatch.setPropertyHolder(this);
        }

        return this.getProperties().some((eachProperty) => propertyMatch.match(eachProperty));
    }

    matchNameAndValue(name: string, value: any): boolean {
        return this.match(new PropertyIsEqual(new Property(name, value)));
    }

    matchValue(value: any): boolean {
        return this.matchCallback((property) => Property.valueEquals(property.getValue(), value));
    }

    matchRegExp(name: string, regex: RegExp): boolean {
        return this.match(new ValueMatchesRegex(name, regex));
    }

    matchCallback(callback: (property: Property) => boolean): boolean {
        return this.match(new PropertyPassesTest(callback));
    }

    getProperty<T = any>(name: string, defaultValue: T = null as any): Property<T> {
        if (this.propertyExists(name)) {
            return this.properties[name];
        }

        return new Property<T>(name, defaultValue);
    }

    setProperty(property: Property): void {
        this.protect(property.getName());

        this.properties[property.getName()] = property;
    }

    getProperties(): Property[] {
        return Object.values(this.properties);
    }

    removeProperty(name: string): void {
        this.protect(name);

        delete this.properties[name];
    }

    prop<T = any>(name: string, defaultValue: T = null as any): Property<T> {
        return this.getProperty(name, defaultValue);
    }

    abstract getProtectedNames(): string[];

    private isProtected(name: string) {
        return this.getProtectedNames().indexOf(name) !== -1;
    }

    private protect(name: string) {
        if (this.propertyExists(name) && this.isProtected(name)) {
            throw new CannotModifyProtectedProperty(name);
        }
    }
}
