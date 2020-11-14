import {TreeNode} from "@models/treeNodeModel";
import {flatten} from "lodash";

export const findNodeByIri = (iri: string, root: TreeNode): TreeNode => {
    if (root.iri === iri) {
        return root;
    }

    if (root.children) {
        const childrenArr = flatten([root.children])
        let result = undefined;
        for (let i = 0; result === undefined && i < childrenArr.length; i++) {
            result = findNodeByIri(iri, childrenArr[i]);
        }
        return result;
    }

    return undefined;
}

export const findNodeParentByIri = (childIri: string, root: TreeNode): TreeNode => {
    if (childIri === root.iri) {
        return undefined;
    }

    if (root.children) {
        const childrenArr = flatten([root.children])
        let parent = undefined;
        for (let i = 0; parent === undefined && i < childrenArr.length; i++) {
            if(childIri === childrenArr[i].iri) {
                parent = root;
                break;
            }
            parent = findNodeParentByIri(childIri, childrenArr[i]);
        }
        return parent;
    }

    return undefined;
}