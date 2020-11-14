import {TreeNode} from "@models/treeNodeModel";

interface JointProps {
    addSelf: (any) => void,
}

export interface JointEventShapeProps extends JointProps {
    treeNode: TreeNode,
    parentShape?: any
}

export interface JointConnectorShapeProps extends JointProps {
    source: any,
    target: any
}