import * as React from "react";
import * as _ from "lodash";
import {useEffect, useState} from "react";
import {EventType} from "@models/eventModel";
import ConnectorShape from "@components/editor/shapes/ConnectorShape";
import {JointEventShapeProps} from "@components/editor/shapes/EventShapeProps";
import {createShape} from "@services/jointService";

const FaultEventShape = ({addSelf, treeNode, parentShape}: JointEventShapeProps) => {
    const [currentShape, setCurrentShape] = useState<any>(undefined)

    useEffect(() => {
        const eventShape = createShape(treeNode);
        addSelf(eventShape)

        const faultEvent = treeNode.event;
        if (faultEvent.eventType == EventType.INTERMEDIATE) {
            // @ts-ignore
            eventShape.gate(faultEvent.gateType.toLowerCase())
        }

        eventShape.attr(['label', 'text'], faultEvent.name);
        eventShape.attr(['probabilityLabel', 'text'], faultEvent.rpn?.probability);
        // @ts-ignore
        eventShape.set('custom/nodeIri', treeNode.iri)

        setCurrentShape(eventShape)

        return () => eventShape.remove();
    }, [treeNode]);

    return (
        <React.Fragment>
            {
                currentShape && _.flatten([treeNode.children])
                    .map(value => <FaultEventShape addSelf={addSelf} treeNode={value}
                                                   key={value.iri} parentShape={currentShape}/>
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