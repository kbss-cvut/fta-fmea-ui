import {useEffect, useState} from "react";
import * as React from "react";
import * as joint from 'jointjs';
import {Gate} from "@models/eventModel";
import JointEventShape from "@components/editor/shapes/JointEventShape";
import {JointEventShapeProps} from "@components/editor/shapes/EventShapeProps";
import JointConnectorShape from "@components/editor/shapes/JointConnectorShape";
import {computeDimensions} from "@utils/jointUtils";
import * as _ from "lodash";


const JointGateShape = ({addSelf, treeNode, parentShape}: JointEventShapeProps) => {
    const [currentRect, setCurrentRect] = useState<any>(undefined)

    useEffect(() => {
        const rect = new joint.shapes.standard.Rectangle()
        addSelf(rect)
        setCurrentRect(rect)
    }, []);

    useEffect(() => {
        if (currentRect) {
            const label = (treeNode.event as Gate).gateType
            const [width, height, textSize] = computeDimensions(label)

            currentRect.resize(width, height)
            currentRect.attr({
                size: {width: width, height: height},
                body: {
                    fill: 'green'
                },
                label: {
                    text: label,
                    fill: 'black',
                },
                text: {'font-size': textSize},
            })

            // @ts-ignore
            currentRect.set('custom/nodeIri', treeNode.iri)
        }
    }, [treeNode, currentRect])

    return (
        <div>{
            _.flatten([treeNode.children])
                .map(value => {
                    return <React.Fragment key={`fragment-${value.iri}`}>
                        {currentRect &&
                        <JointEventShape addSelf={addSelf} treeNode={value} key={value.iri} parentShape={currentRect}/>}
                        {
                            currentRect && parentShape &&
                            <JointConnectorShape addSelf={addSelf}
                                                 key={`connector-${currentRect.key}-${parentShape.key}`}
                                                 source={currentRect} target={parentShape}/>
                        }
                    </React.Fragment>
                })
        }</div>);
}

export default JointGateShape;