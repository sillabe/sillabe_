import jexl from 'jexl';
import { Node } from './Node';
import { IPropertyMatch } from '../property/match/IPropertyMatch';

export abstract class NodeList<L extends NodeList<any>, T extends Node = Node> {
    constructor(private readonly nodes: T[]) {}

    count() {
        return this.nodes.length;
    }

    toArray(): T[] {
        return this.nodes;
    }

    find(callback: (node: T) => boolean): T | undefined {
        return this.nodes.find(callback);
    }

    filter(callback: (node: T) => boolean): L {
        return new (this.constructor as { new (nodes: T[]): L })(this.nodes.filter(callback));
    }

    map(callback: (node: T) => void): any {
        return this.nodes.map(callback);
    }

    where(expression: string): L {
        return this.filter((node: T) => {
            const evaluator = new jexl.Jexl();

            return Boolean(
                evaluator.evalSync(expression, {
                    url: node.getUrl().toString(),
                    path: node.getPath().toString(),
                    dynamic: node.isDynamic(),
                    ...node.getProperties().reduce(
                        (previous, current) => ({
                            ...previous,
                            [current.getName()]: current.getValue(),
                        }),
                        {},
                    ),
                }),
            );
        });
    }

    whereProperty(propertyMatch: IPropertyMatch): L {
        return this.filter((eachNode) => eachNode.match(propertyMatch));
    }

    except(node: T): L {
        return this.filter((eachNode) => !eachNode.is(node));
    }

    first(): T | null {
        if (this.count() === 0) {
            return null;
        }

        return this.nodes[0];
    }

    contains(node: T): boolean {
        return this.filter((eachNode) => eachNode.is(node)).count() === 1;
    }

    [Symbol.iterator]() {
        return this.toArray().values();
    }
}
