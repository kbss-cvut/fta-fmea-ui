import {TreeNode} from "@models/treeNodeModel";
import {Event} from "@models/eventModel";
import {flatten} from "lodash";

export const findNodeByIri = (iri: string, root: TreeNode<Event>): TreeNode<Event> => {
    const [node,] = findNodeByIriWithParent(iri, root);
    return node;
}

export const findNodeByIriWithParent = (iri: string, root: TreeNode<Event>): TreeNode<Event>[] => {
    if (root.iri === iri) {
        return [root, undefined];
    }

    if (root.children) {
        const childrenArr = flatten([root.children])
        let result = undefined;
        let parent = undefined;
        for (let i = 0; result === undefined && i < childrenArr.length; i++) {
            parent = childrenArr[i];
            result = findNodeByIri(iri, parent);
        }
        return [result, parent];
    }

    return [undefined, undefined];
}