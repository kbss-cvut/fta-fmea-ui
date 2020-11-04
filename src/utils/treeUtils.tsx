import {TreeNode} from "@models/treeNodeModel";
import {Event} from "@models/eventModel";
import * as _ from "lodash";

export const findNodeByIri = (iri: string, root: TreeNode<Event>): TreeNode<Event> => {
    if (root.iri === iri) return root;

    if (root.children) {
        const childrenArr = _.flatten([root.children])
        let result = undefined;
        for (let i = 0; result === undefined && i < childrenArr.length; i++) {
            result = findNodeByIri(iri, childrenArr[i]);
        }
        return result;
    }

    return undefined;
}