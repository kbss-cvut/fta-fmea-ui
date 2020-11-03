import * as React from "react";
import {useEffect, useState} from "react";
import * as joint from 'jointjs';
import {FaultEvent} from "@models/eventModel";
import JointGateShape from "@components/editor/shapes/JointGateShape";
import {flatten} from "@utils/arrayUtils";
import {JointEventShapeProps} from "@components/editor/shapes/EventShapeProps";
import JointConnectorShape from "@components/editor/shapes/JointConnectorShape";
import {_computeDimensions} from "@utils/jointUtils";

const JointEventShape = ({addSelf, treeNode, parentShape}: JointEventShapeProps) => {
    const [currentRect, setCurrentRect] = useState<any>(undefined)

    useEffect(() => {
        const label = (treeNode.event as FaultEvent).name;
        const [width, height, textSize] = _computeDimensions(label);

        const rect = new joint.shapes.standard.Rectangle()
        rect.resize(width, height)
        rect.attr({
            size: {width: width, height: height},
            body: {
                fill: 'blue'
            },
            label: {
                text: label,
                fill: 'white',
            },
            text: {'font-size': textSize},
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
                    return <React.Fragment key={`fragment-${value.iri}`}>
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