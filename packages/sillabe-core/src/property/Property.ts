import equal from 'deep-equal';

export class Property<T = any> {
    constructor(private readonly name: string, private readonly value: T) {}

    getName(): string {
        return this.name;
    }

    getValue(): T {
        return this.value;
    }

    is(property: Property): boolean {
        return this.name === property.getName() && Property.valueEquals(this.value, property.getValue());
    }

    static valueEquals(left: any, right: any) {
        return equal(left, right);
    }
}
