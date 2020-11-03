import * as React from "react";
import {useEffect, useState} from "react";
import * as joint from 'jointjs';
import {TreeNode} from "@models/treeNodeModel";
import {Event, FaultEvent, Gate, GateType} from "@models/eventModel";
import JointGateShape from "@components/editor/shapes/JointGateShape";
import {flatten} from "@utils/arrayUtils";

interface JointEventShapeProps {
    graph: any,
    treeNode: TreeNode<Event>
}

const JointEventShape = ({graph, treeNode}: JointEventShapeProps) => {
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
        rect.addTo(graph)
    }, []);

    return (
        <div>{
            flatten([treeNode.children])
                .map(value => <JointGateShape graph={graph} treeNode={value} key={value.iri}/>)
        }</div>
    )
}

export default JointEventShape;