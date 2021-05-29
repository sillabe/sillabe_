import { IPropertyMatch } from './IPropertyMatch';
import { Property } from '../Property';

export class PropertyMatchIntersection implements IPropertyMatch {
    private operands: IPropertyMatch[];

    constructor(...operands: IPropertyMatch[]) {
        this.operands = operands;
    }

    match(property: Property): boolean {
        return this.operands.every((operand) => operand.match(property));
    }
}
