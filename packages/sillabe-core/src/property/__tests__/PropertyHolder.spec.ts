import { CannotModifyProtectedProperty } from '../../error/CannotModifyProtectedProperty';
import { PropertyHolder } from '../PropertyHolder';
import { PropertyMatchUnion } from '../match/PropertyMatchUnion';
import { PropertyIsEqual } from '../match/PropertyIsEqual';
import { IPropertyHolderAwareMatch } from '../match/IPropertyHolderAwareMatch';
import { PropertyMatchIntersection } from '../match/PropertyMatchIntersection';
import { NegateMatch } from '../match/NegateMatch';
import { ValueMatchesRegex } from '../match/ValueMatchesRegex';
import { Property } from '../Property';

class ConcretePropertyHolder extends PropertyHolder {
    constructor(properties: Property[] = []) {
        super(properties);
    }

    getProtectedNames(): string[] {
        return ['example'];
    }
}

class PropertyHolderAwareMatch extends PropertyIsEqual implements IPropertyHolderAwareMatch {
    propertyHolder: PropertyHolder | null = null;

    setPropertyHolder(propertyHolder: PropertyHolder) {
        this.propertyHolder = propertyHolder;
    }
}

describe('PropertyHolder', () => {
    const exampleProperty = new Property('example', 'someValue');
    const otherProperty = new Property('otherExample', 'someOtherValue');
    const arrayProperty = new Property('arrayExample', [1, 2, 3]);
    const propertyHolder = new ConcretePropertyHolder();

    it('should handle properties with different types of values', () => {
        propertyHolder.setProperty(arrayProperty);
        expect(propertyHolder.matchValue([1, 2, 3])).toBeTruthy();
    });

    it('should set a protected property once', () => {
        propertyHolder.setProperty(exampleProperty);
    });

    it('should a return value for non existing properties', () => {
        const nonExistingWithoutDefault = propertyHolder.getProperty('non-existing');
        expect(nonExistingWithoutDefault.getValue()).toBeNull();
        const nonExistingWithDefault = propertyHolder.getProperty('non-existing', 'something');
        expect(nonExistingWithDefault.getValue()).toBe('something');
    });

    it('should have already a property set', () => {
        expect(propertyHolder.match(new PropertyHolderAwareMatch(exampleProperty))).toBeTruthy();
        expect(propertyHolder.propertyExists('example')).toBeTruthy();
        expect(propertyHolder.hasProperty(exampleProperty)).toBeTruthy();
        expect(propertyHolder.getProperty('example').is(exampleProperty));
    });

    it('should match equal properties', () => {
        expect(propertyHolder.matchNameAndValue('example', 'someValue')).toBeTruthy();
        expect(propertyHolder.matchNameAndValue('example', 'otherValue')).toBeFalsy();
        expect(propertyHolder.matchValue('someValue')).toBeTruthy();
    });

    it('should match negated properties', () => {
        expect(
            propertyHolder.match(new NegateMatch(new PropertyIsEqual(new Property('not-name', 'not-value')))),
        ).toBeTruthy();
    });

    it('should match regex properties', () => {
        expect(propertyHolder.matchRegExp('example', /some*/)).toBeTruthy();
        expect(propertyHolder.matchRegExp('example', /nonMatching*/)).toBeFalsy();
    });

    it('should match callback properties', () => {
        expect(propertyHolder.matchCallback((property) => property.getValue() === 'someValue')).toBeTruthy();
    });

    it('should set a new property', () => {
        expect(propertyHolder.hasProperty(otherProperty)).toBeFalsy();
        propertyHolder.setProperty(otherProperty);
        expect(propertyHolder.hasProperty(otherProperty)).toBeTruthy();
    });

    it('should remove an unprotected property', () => {
        propertyHolder.setProperty(otherProperty);
        expect(propertyHolder.hasProperty(otherProperty)).toBeTruthy();
        propertyHolder.removeProperty(otherProperty.getName());
        expect(propertyHolder.hasProperty(otherProperty)).toBeFalsy();
    });

    it('cannot set a protected property again', () => {
        expect(() => {
            propertyHolder.setProperty(exampleProperty);
        }).toThrowError(new CannotModifyProtectedProperty(exampleProperty.getName()));
    });

    it('should match a property match union', () => {
        const matchingUnion = new PropertyMatchUnion(
            new ValueMatchesRegex('example', /some/),
            new ValueMatchesRegex('example', /wrongValue/),
        );
        const nonMatchingUnion = new PropertyMatchUnion(
            new ValueMatchesRegex('example', /wrongValue/),
            new ValueMatchesRegex('example', /otherWrongValue/),
        );

        expect(propertyHolder.match(matchingUnion)).toBeTruthy();
        expect(propertyHolder.match(nonMatchingUnion)).toBeFalsy();
    });

    it('should match a property match intersection', () => {
        const matchingIntersection = new PropertyMatchIntersection(
            new ValueMatchesRegex('example', /some/),
            new ValueMatchesRegex('example', /Value/),
        );
        const nonMatchingIntersection = new PropertyMatchIntersection(
            new ValueMatchesRegex('example', /some/),
            new ValueMatchesRegex('example', /otherWrongValue/),
        );

        expect(propertyHolder.match(matchingIntersection)).toBeTruthy();
        expect(propertyHolder.match(nonMatchingIntersection)).toBeFalsy();
    });

    it('should not match regex when property is null', () => {
        const property = new Property('null-property', null);
        const match = new ValueMatchesRegex('null-property', /someRegex/);

        expect(match.match(property)).toBeFalsy();
    });
});
