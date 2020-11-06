import * as React from "react";
import {Event, FaultEvent} from "@models/eventModel";
import {TreeNode, TreeNodeType} from "@models/treeNodeModel";
import FaultEventDialog from "@components/dialog/faultEvent/FaultEventDialog";
import GateDialog from "@components/dialog/gate/GateDialog";

export interface EventDialogProps {
    open: boolean,
    nodeIri: string,
    onCreated: (newNode: TreeNode<Event>) => void,
    onClose: () => void,
}

interface Props extends EventDialogProps {
    nodeType: TreeNodeType
}

const EventDialog = ({open, nodeIri, nodeType, onCreated, onClose}: Props) => {

    let dialog;
    switch (nodeType) {
        case TreeNodeType.EVENT:
            dialog = <GateDialog open={open} nodeIri={nodeIri} onCreated={onCreated} onClose={onClose}/>
            break;
        case TreeNodeType.GATE:
            dialog = <FaultEventDialog open={open} nodeIri={nodeIri} onCreated={onCreated} onClose={onClose}/>
            break;
        default:
            dialog = null;
            break;
    }

    return (dialog)
}

export default EventDialog;