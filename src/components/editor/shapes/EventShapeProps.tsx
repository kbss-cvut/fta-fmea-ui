import {TreeNode} from "@models/treeNodeModel";
import {Event} from "@models/eventModel";

interface JointProps {
    addSelf: (any) => void,
}

export interface JointEventShapeProps extends JointProps {
    treeRoot: TreeNode<Event>,
    treeNode: TreeNode<Event>,
    parentShape?: any
}

export interface JointConnectorShapeProps extends JointProps {
    source: any,
    target: any
}