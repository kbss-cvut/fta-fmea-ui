import * as React from "react";
import {useEffect} from "react";
import * as joint from 'jointjs';
import {JointConnectorShapeProps} from "@components/editor/shapes/EventShapeProps";


const JointConnectorShape = ({graph, source, target}: JointConnectorShapeProps) => {
    useEffect(() => {
        const link = new joint.shapes.standard.Link();
        link.source(source);
        link.target(target);
        link.addTo(graph);
    }, []);

    return <div/>;
}

export default JointConnectorShape;

