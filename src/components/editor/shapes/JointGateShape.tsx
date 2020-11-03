import {useEffect, useRef, useState} from "react";
import * as React from "react";
import * as joint from 'jointjs';
import {TreeNode} from "@models/treeNodeModel";
import {Event, FaultEvent, Gate} from "@models/eventModel";
import {flatten} from "@utils/arrayUtils";
import JointEventShape from "@components/editor/shapes/JointEventShape";

interface JointGateShapeProps {
    graph: any,
    treeNode: TreeNode<Event>
}

const JointGateShape = ({graph, treeNode}: JointGateShapeProps) => {
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
    }, []);

    return (
        <div>{
            flatten([treeNode.children])
                .map(value => <JointEventShape graph={graph} treeNode={value} key={value.iri}/>)
        }</div>);
}

export default JointGateShape;