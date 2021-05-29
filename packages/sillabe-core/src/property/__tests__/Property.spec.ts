import { Property } from '../Property';

describe('Property', () => {
    const property = new Property('name', 'value');
    const otherEqualProperty = new Property('name', 'value');
    const sameNameDifferentValue = new Property('name', 'differentValue');
    const differentProperty = new Property('otherName', 'otherValue');
    const integerProperty = new Property('someNumber', 10);

    it('should match an equal property', () => {
        expect(property.is(otherEqualProperty)).toBeTruthy();
    });

    it('should not match a different property', () => {
        expect(property.is(sameNameDifferentValue)).toBeFalsy();
        expect(property.is(differentProperty)).toBeFalsy();
    });

    it('should support values of any type', () => {
        expect(typeof integerProperty.getValue()).toBe('number');
    });
});
