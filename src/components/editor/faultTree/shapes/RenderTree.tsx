import { createShape } from "../../../../services/jointService";
import { EventType } from "../../../../models/eventModel";
import { sequenceListToArray } from "../../../../services/faultEventService";
import * as faultEventService from "../../../../services/faultEventService";
import { Link } from "./shapesDefinitions";
import { flatten } from "lodash";
import { has } from "lodash";
import { JOINTJS_NODE_MODEL } from "@components/editor/faultTree/shapes/constants";
import { getNodeWidthForText } from "@utils/treeUtils";

const renderLink = (container, source, target, shouldHighlight) => {
  // @ts-ignore
  const link = Link.create(source, target);
  if (shouldHighlight) {
    link.attr("line/stroke", "red");
    link.addTo(container);
    link.toFront();
  } else {
    link.addTo(container);
  }
};

const highlightCheck = (path, iri) => {
  const flattenedPath = path.flat(Infinity);
  const iriArray = flattenedPath.map((item) => item?.iri);
  return iriArray.includes(iri);
};

const renderTree = (container, node, parentShape = null, pathsToHighlight) => {
  const shouldHighlight = pathsToHighlight ? highlightCheck(pathsToHighlight, node.iri) : false;

  // render node shape
  let nodeShape = createShape(node);
  nodeShape.addTo(container);
  if (node.eventType == EventType.INTERMEDIATE) {
    // @ts-ignore
    nodeShape.gate(node.gateType.toLowerCase());
  }

  const width = getNodeWidthForText(node.description, 12, 100);
  if (width > 100) nodeShape.prop("size", { width: width });

  nodeShape.attr(["label", "text"], node.name);
  if (has(node, "probability")) {
    nodeShape.attr(["probabilityLabel", "text"], node.probability.toExponential(2));
  }
  if (has(node, "probabilityRequirement")) {
    nodeShape.attr(["probabilityRequirementLabel", "text"], node.probability.toExponential(2));
  }
  if (shouldHighlight) {
    nodeShape.attr("body/stroke", "red");
    nodeShape.attr("body/fill", "red");
    nodeShape.attr("gate/stroke", "red");
    nodeShape.attr("gate/fill", "red");
  }
  // @ts-ignore
  nodeShape.set(JOINTJS_NODE_MODEL.faultEventIri, node.iri);
  const r = node.rectangle;
  if (r && r.x && r.y && r.width && r.height) {
    nodeShape.position(node.rectangle.x, node.rectangle.y);
    // @ts-ignore
    nodeShape.set(JOINTJS_NODE_MODEL.hasPersistentPosition, true);
  }
  // Render link
  if (parentShape) {
    renderLink(container, parentShape, nodeShape, shouldHighlight);
  }

  // render children
  // sort children in diagram
  const sequence = sequenceListToArray(node.childrenSequence);
  faultEventService.eventChildrenSorted(flatten([node.children]), sequence);
  const childNodes = faultEventService.eventChildrenSorted(flatten([node.children]), sequence);
  if (childNodes) childNodes.forEach((n) => renderTree(container, n, nodeShape, pathsToHighlight));
};

export default renderTree;
