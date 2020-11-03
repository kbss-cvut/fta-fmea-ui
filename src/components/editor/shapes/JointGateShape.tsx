import {useEffect, useRef, useState} from "react";
import * as React from "react";
import * as joint from 'jointjs';
import {Gate} from "@models/eventModel";
import {flatten} from "@utils/arrayUtils";
import JointEventShape from "@components/editor/shapes/JointEventShape";
import {JointEventShapeProps} from "@components/editor/shapes/EventShapeProps";
import JointConnectorShape from "@components/editor/shapes/JointConnectorShape";


const JointGateShape = ({graph, treeNode, parentShape}: JointEventShapeProps) => {
    const [currentRect, setCurrentRect] = useState<any>(undefined)

    useEffect(() => {
        const rect = new joint.shapes.standard.Rectangle()
        rect.position(200, 30)
        rect.resize(100, 40)
        rect.attr({
            body: {
                fill: 'green'
            },
            label: {
                text: (treeNode.event as Gate).gateType,
                fill: 'black'
            },
        })
        graph.addCell(rect)

        setCurrentRect(rect)
    }, []);

    return (
        <div>{
            flatten([treeNode.children])
                .map(value => {
                    return <React.Fragment>
                        {currentRect &&
                        <JointEventShape graph={graph} treeNode={value} key={value.iri} parentShape={currentRect}/>}
                        {
                            currentRect && parentShape &&
                            <JointConnectorShape graph={graph} key={`connector-${currentRect.key}-${parentShape.key}`}
                                                 source={currentRect} target={parentShape}/>
                        }
                    </React.Fragment>
                })
        }</div>);
}

export default JointGateShape;