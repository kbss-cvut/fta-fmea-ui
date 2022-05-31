import {createShape} from "../../../../services/jointService";
import {EventType} from "../../../../models/eventModel";
import {sequenceListToArray} from "../../../../services/faultEventService";
import * as faultEventService from "../../../../services/faultEventService";
import {Link} from "./shapesDefinitions";
import {flatten} from "lodash";
import {has} from "lodash";

const renderLink = (container, source, target) => {
    // @ts-ignore
    const link = Link.create(source, target);
    link.addTo(container);
};


const renderTree = (container, node, parentShape = null) => {
    // render node shape
    let nodeShape = createShape(node);
    nodeShape.addTo(container)
    if (node.eventType == EventType.INTERMEDIATE) {
        // @ts-ignore
        nodeShape.gate(node.gateType.toLowerCase())
    }
    nodeShape.attr(['label', 'text'], node.name);
    if (has(node, 'probability')) {
        nodeShape.attr(['probabilityLabel', 'text'], node.probability.toExponential(2));
    }
    // @ts-ignore
    nodeShape.set('custom/faultEventIri', node.iri)

    // Render link
    if(parentShape){
        renderLink(container, parentShape, nodeShape)
    }

    // render children
    // sort children in diagram
    const sequence = sequenceListToArray(node.childrenSequence)
    faultEventService.eventChildrenSorted(flatten([node.children]), sequence)
    const childNodes = faultEventService.eventChildrenSorted(flatten([node.children]), sequence)
    if(childNodes)
        childNodes.forEach(n => renderTree(container, n, nodeShape));
};

export default renderTree;