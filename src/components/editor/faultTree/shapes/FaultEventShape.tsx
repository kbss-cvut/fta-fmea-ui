import * as React from "react";
import {flatten} from "lodash";
import {useEffect, useState} from "react";
import {EventType, FaultEvent} from "@models/eventModel";
import ConnectorShape from "./ConnectorShape";
import {JointEventShapeProps} from "./EventShapeProps";
import {createShape} from "@services/jointService";
import {sequenceListToArray} from "@services/faultEventService";
import * as faultEventService from "@services/faultEventService";

const FaultEventShape = ({addSelf, treeEvent, parentShape}: JointEventShapeProps) => {
    const [currentShape, setCurrentShape] = useState<any>(undefined)
    const [sortedChildren, setSortedChildren] = useState<FaultEvent[]>([]);

    useEffect(() => {
        const eventShape = createShape(treeEvent);
        addSelf(eventShape)

        if (treeEvent.eventType == EventType.INTERMEDIATE) {
            // @ts-ignore
            eventShape.gate(treeEvent.gateType.toLowerCase())
        }

        eventShape.attr(['label', 'text'], treeEvent.name);
        if (treeEvent.probability) {
            eventShape.attr(['probabilityLabel', 'text'], treeEvent.probability.toExponential(2));
        }

        // @ts-ignore
        eventShape.set('custom/faultEventIri', treeEvent.iri)

        setCurrentShape(eventShape)

        // sort children in diagram
        const sequence = sequenceListToArray(treeEvent.childrenSequence)
        setSortedChildren(faultEventService.eventChildrenSorted(flatten([treeEvent.children]), sequence))

        return () => eventShape.remove();
    }, [treeEvent]);

    return (
        <React.Fragment>
            {
                currentShape && sortedChildren.map(value =>
                    <FaultEventShape addSelf={addSelf} treeEvent={value} key={value.iri} parentShape={currentShape}/>
                )}
            {
                currentShape && parentShape &&
                <ConnectorShape addSelf={addSelf}
                                key={`connector-${currentShape.id}-${parentShape.id}`}
                                source={parentShape} target={currentShape}/>

            }
        </React.Fragment>
    )
}

export default FaultEventShape;