import { createShape } from "../../../../services/jointService";
import { EventType } from "../../../../models/eventModel";
import { sequenceListToArray } from "../../../../services/faultEventService";
import * as faultEventService from "../../../../services/faultEventService";
import { Link } from "./shapesDefinitions";
import { flatten } from "lodash";
import { has } from "lodash";
import {
  ERROR_PATH_COLOR,
  JOINTJS_NODE_MODEL,
  DEFAULT_NODE_SHAPE_SIZE,
  LABEL_FONT_SIZE,
} from "@components/editor/faultTree/shapes/constants";
import { getNodeWidthForText } from "@utils/treeUtils";

const renderLink = (container, source, target, shouldHighlight) => {
  // @ts-ignore
  const link = Link.create(source, target);
  if (shouldHighlight) {
    link.attr("line/stroke", ERROR_PATH_COLOR);
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

const renderTree = async (container, node, parentShape = null, pathsToHighlight) => {
  const shouldHighlight = pathsToHighlight ? highlightCheck(pathsToHighlight, node.iri) : false;
  // render node shape
  let nodeShape = createShape(node);
  nodeShape.addTo(container);

  if (node.eventType === EventType.INTERMEDIATE) {
    // @ts-ignore
    nodeShape.gate(node.gateType.toLowerCase());
  }

  const width = getNodeWidthForText(node.description, LABEL_FONT_SIZE, DEFAULT_NODE_SHAPE_SIZE);
  if (width > DEFAULT_NODE_SHAPE_SIZE) nodeShape.prop("size", { width: width });

  nodeShape.attr(["label", "text"], node.name);
  if (has(node, "probability")) {
    nodeShape.attr(["probabilityLabel", "text"], node.probability.toExponential(2));
  }
  if (has(node, "probabilityRequirement")) {
    nodeShape.attr(["probabilityRequirementLabel", "text"], node.probabilityRequirement.toExponential(2));
  }
  if (shouldHighlight) {
    nodeShape.attr("body/stroke", ERROR_PATH_COLOR);
    nodeShape.attr("body/fill", ERROR_PATH_COLOR);
    nodeShape.attr("gate/stroke", ERROR_PATH_COLOR);
    nodeShape.attr("gate/fill", ERROR_PATH_COLOR);
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
  if (childNodes) {
    await Promise.all(childNodes.map(n => renderTree(container, n, nodeShape, pathsToHighlight)));
  }
};

export default renderTree;
