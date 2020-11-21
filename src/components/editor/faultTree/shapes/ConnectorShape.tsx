import * as React from "react";
import {useEffect} from "react";
import {JointConnectorShapeProps} from "./EventShapeProps";
import {Link} from "./shapesDefinitions";


const ConnectorShape = ({addSelf, source, target}: JointConnectorShapeProps) => {
    useEffect(() => {
        // @ts-ignore
        const link = Link.create(source, target);
        addSelf(link);

        return () => link.remove();
    }, []);

    return <div/>;
}

export default ConnectorShape;

