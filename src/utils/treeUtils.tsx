import { flatten } from "lodash";
import { FaultEvent } from "@models/eventModel";

export const findEventByIri = (iri: string, root: FaultEvent): FaultEvent => {
  if (root.iri === iri) {
    return root;
  }

  if (root.children) {
    const childrenArr = flatten([root.children]);
    let result = undefined;
    for (let i = 0; result === undefined && i < childrenArr.length; i++) {
      result = findEventByIri(iri, childrenArr[i]);
    }
    return result;
  }

  return undefined;
};

export const findEventParentByIri = (childIri: string, root: FaultEvent): FaultEvent => {
  if (childIri === root.iri) {
    return undefined;
  }

  if (root.children) {
    const childrenArr = flatten([root.children]);
    let parent = undefined;
    for (let i = 0; parent === undefined && i < childrenArr.length; i++) {
      if (childIri === childrenArr[i].iri) {
        parent = root;
        break;
      }
      parent = findEventParentByIri(childIri, childrenArr[i]);
    }
    return parent;
  }

  return undefined;
};

export const findNodeByIri = (node, targetIri) => {
  if (node.iri === targetIri) {
    return [node];
  }

  if (Array.isArray(node.children)) {
    for (const childNode of node.children) {
      const path = findNodeByIri(childNode, targetIri);
      if (path.length > 0) {
        return [node, ...path];
      }
    }
  }

  return [];
};
