import * as React from "react";
import {useEffect, useState} from "react";
import {EventType} from "@models/eventModel";
import JointConnectorShape from "@components/editor/shapes/JointConnectorShape";
import * as _ from "lodash";
import {JointEventShapeProps} from "@components/editor/shapes/EventShapeProps";
import {createShape} from "@services/jointService";

const JointEventShape = ({addSelf, treeNode, parentShape}: JointEventShapeProps) => {
    const [currentShape, setCurrentShape] = useState<any>(undefined)

    useEffect(() => {
        const eventShape = createShape(treeNode);
        addSelf(eventShape)
        setCurrentShape(eventShape)

        return () => eventShape.remove();
    }, []);

    useEffect(() => {
        if (currentShape) {
            const faultEvent = treeNode.event;
            if (faultEvent.eventType == EventType.INTERMEDIATE) {
                currentShape.gate(faultEvent.gateType.toLowerCase())
            }

            // TODO remove gate on event type change?

            currentShape.attr(['label', 'text'], faultEvent.name);
            // @ts-ignore
            currentShape.set('custom/nodeIri', treeNode.iri)
        }
    }, [treeNode, currentShape])

    return (
        <React.Fragment>
            {
                currentShape && _.flatten([treeNode.children])
                    .map(value => <JointEventShape addSelf={addSelf} treeNode={value}
                                                   key={value.iri} parentShape={currentShape}/>
                    )}
            {
                currentShape && parentShape &&
                <JointConnectorShape addSelf={addSelf}
                                     key={`connector-${currentShape.id}-${parentShape.id}`}
                                     source={parentShape} target={currentShape}/>

            }
        </React.Fragment>
    )
}

export default JointEventShape;