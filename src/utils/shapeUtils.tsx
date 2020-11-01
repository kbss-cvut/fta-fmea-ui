import {TreeNode} from "@models/treeNodeModel";
import {Event} from "@models/eventModel";

export interface ShapePosition {
    x: number,
    y: number,
}

export interface EventShapeProps<T extends Event> {
    position: ShapePosition,
    parentPosition?: ShapePosition,
    data: TreeNode<T>,
    showSnackbar: (string, SnackbarType) => void
}