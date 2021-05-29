import { NodeType } from '../NodeType';
import { PropertyIsEqual } from '../../property/match/PropertyIsEqual';
import { Property } from '../../property/Property';
import { Node } from '../Node';
import { NodeList } from '../NodeList';
import { Path } from '../../filesystem/Path';
import { Url } from '../../url/Url';

class ConcreteNode extends Node {
    getNodeType(): NodeType {
        return NodeType.Post;
    }

    getProtectedNames(): string[] {
        return [];
    }
}

class ConcreteNodeList extends NodeList<ConcreteNodeList, ConcreteNode> {}

describe('NodeList', () => {
    const path = new Path('some-path');
    const node = new ConcreteNode(new Url('/'), path, false, [new Property('name', 'value')]);
    const nodeList = new ConcreteNodeList([node]);

    it('should count all nodes', () => {
        expect(nodeList.count()).toBe(1);
    });

    it('should return the list of nodes', () => {
        expect(nodeList.toArray()).toEqual([node]);
    });

    it('should map all nodes', () => {
        expect(nodeList.map((node) => node.getPath())).toEqual([path]);
    });

    it('should find a node', () => {
        expect(nodeList.find((n) => n.is(node))).toBe(node);
    });

    it('should filter nodes based on an expression', () => {
        expect(nodeList.where('url == "/"').count()).toBe(1);
        expect(nodeList.where('name == "value"').count()).toBe(1);
    });

    it('should filter nodes that match a property match', () => {
        expect(nodeList.whereProperty(new PropertyIsEqual(new Property('name', 'value'))).count()).toBe(1);
        expect(nodeList.whereProperty(new PropertyIsEqual(new Property('name', 'wrongValue'))).count()).toBe(0);
    });

    it('should return a new NodeList without a certain node', () => {
        expect(nodeList.except(node).count()).toBe(0);
    });

    it('should return the first node', () => {
        expect(nodeList.first()).toBe(node);
    });

    it('should return null when calling first if there are no items', () => {
        expect(nodeList.except(node).first()).toBeNull();
    });

    it('should check whether a node is present', () => {
        expect(nodeList.contains(node)).toBeTruthy();
        expect(nodeList.contains(new ConcreteNode(new Url('/'), new Path('other-path'), false, []))).toBeFalsy();
    });
});
