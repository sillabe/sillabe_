import { IPropertyMatch } from './IPropertyMatch';
import { Property } from '../Property';

export class PropertyMatchUnion implements IPropertyMatch {
    private operands: IPropertyMatch[];

    constructor(...operands: IPropertyMatch[]) {
        this.operands = operands;
    }

    match(property: Property): boolean {
        return this.operands.some((operand) => operand.match(property));
    }
}
