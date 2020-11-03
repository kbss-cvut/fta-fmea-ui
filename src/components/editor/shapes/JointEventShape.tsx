import * as React from "react";
import {useEffect, useState} from "react";
import * as joint from 'jointjs';
import {FaultEvent} from "@models/eventModel";
import JointGateShape from "@components/editor/shapes/JointGateShape";
import {flatten} from "@utils/arrayUtils";
import {JointEventShapeProps} from "@components/editor/shapes/EventShapeProps";
import JointConnectorShape from "@components/editor/shapes/JointConnectorShape";


const JointEventShape = ({addSelf, treeNode, parentShape}: JointEventShapeProps) => {
    const [currentRect, setCurrentRect] = useState<any>(undefined)

    useEffect(() => {
        const rect = new joint.shapes.standard.Rectangle()
        rect.position(100, 30)
        rect.resize(100, 40)
        rect.attr({
            body: {
                fill: 'blue'
            },
            label: {
                text: (treeNode.event as FaultEvent).name,
                fill: 'white'
            },
        })
        addSelf(rect)
        // @ts-ignore
        rect.set('custom/data', treeNode)

        setCurrentRect(rect)
    }, []);

    return (
        <div>{
            flatten([treeNode.children])
                .map(value => {
                    return <React.Fragment>
                        {currentRect &&
                        <JointGateShape addSelf={addSelf} treeNode={value} key={value.iri} parentShape={currentRect}/>}
                        {
                            currentRect && parentShape &&
                            <JointConnectorShape addSelf={addSelf} key={`connector-${currentRect.key}-${parentShape.key}`}
                                                 source={currentRect} target={parentShape}/>
                        }
                    </React.Fragment>
                })
        }</div>
    )
}

export default JointEventShape;