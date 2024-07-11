import { createShape } from "../../../../services/jointService";
import { EventType, isReferencedNode, isRootOrIntermediateNode } from "../../../../models/eventModel";
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
import { Status } from "@utils/constants";

const referenceIcon =
  "M3.9 7c0-1.71 1.39-3.1 3.1-3.1h4V2H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 8h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V12h4c2.76 0 5-2.24 5-5s-2.24-5-5-5";

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

const renderTree = async (container, node, parentShape = null, pathsToHighlight, status = null) => {
  const shouldHighlight = pathsToHighlight ? highlightCheck(pathsToHighlight, node.iri) : false;

  // render node shape
  let nodeShape = createShape(node);
  nodeShape.addTo(container);

  if (node.isReference && node.eventType === EventType.EXTERNAL) {
    nodeShape.attr("icon/d", referenceIcon);
  }

  if (node.eventType === EventType.INTERMEDIATE) {
    // @ts-ignore
    nodeShape.gate(node.gateType.toLowerCase());
  }

  const width = getNodeWidthForText(node.description, LABEL_FONT_SIZE, DEFAULT_NODE_SHAPE_SIZE);
  if (width > DEFAULT_NODE_SHAPE_SIZE) nodeShape.prop("size", { width: width });

  nodeShape.attr(["label", "text"], node.name);
  if (node?.probability) {
    if (node?.selectedEstimate) {
      const iriOfSelectedValue = node.selectedEstimate.iri;
      const { predictionIri, operationalIri } = node.supertypes.supertypes.reduce(
        (acc, item) => {
          if (item?.hasFailureRate?.prediction?.iri) acc.predictionIri = item.hasFailureRate.prediction.iri;
          if (item?.hasFailureRate?.estimate?.iri) acc.operationalIri = item.hasFailureRate.estimate.iri;
          return acc;
        },
        { predictionIri: "", operationalIri: "" },
      );

      if (iriOfSelectedValue === predictionIri) {
        nodeShape.attr(["probabilityLabel", "text"], `(P) ${node.probability.toExponential(2)}`);
      } else if (iriOfSelectedValue === operationalIri) {
        nodeShape.attr(["probabilityLabel", "text"], `(O) ${node.probability.toExponential(2)}`);
      }
    } else {
      if (isReferencedNode(node) || isRootOrIntermediateNode(node)) {
        nodeShape.attr(["probabilityLabel", "text"], `(C) ${node.probability.toExponential(2)}`);
      } else {
        nodeShape.attr(["probabilityLabel", "text"], `(M) ${node.probability.toExponential(2)}`);
      }
    }
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

  if (node?.references?.isPartOf) {
    const iriOfReference = node.references.isPartOf.split("/").pop();
    // @ts-ignore
    nodeShape.set(JOINTJS_NODE_MODEL.redirectTo, iriOfReference);
  }

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
    await Promise.all(childNodes.map((n) => renderTree(container, n, nodeShape, pathsToHighlight)));
  }
};

export default renderTree;
