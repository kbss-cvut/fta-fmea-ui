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
  // If the current node matches the target IRI, return it
  if (node.iri === targetIri) {
    return [node];
  }

  // If the current node has children and it is an array, recursively search each child
  if (Array.isArray(node.children)) {
    for (const childNode of node.children) {
      // Recursively search for the target IRI in the child node
      const path = findNodeByIri(childNode, targetIri);

      // If the target IRI is found in the child node, prepend the current node to the path and return it
      if (path.length > 0) {
        return [node, ...path];
      }
    }
  }

  return [];
};
