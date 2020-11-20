import {FaultEvent} from "@models/eventModel";

interface JointProps {
    addSelf: (any) => void,
}

export interface JointEventShapeProps extends JointProps {
    treeEvent: FaultEvent,
    parentShape?: any
}

export interface JointConnectorShapeProps extends JointProps {
    source: any,
    target: any
}