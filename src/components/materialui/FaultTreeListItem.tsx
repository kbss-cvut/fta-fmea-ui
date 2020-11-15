import * as React from "react";
import IconButton from "@material-ui/core/IconButton";
import {useState} from "react";
import {ListItem, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {contextMenuDefaultAnchor, ElementContextMenuAnchor} from "@components/editor/menu/ElementContextMenu";
import FaultTreeItemContextMenu from "@components/editor/menu/FaultTreeItemContextMenu";
import {FaultTree} from "@models/faultTreeModel";
import {useConfirmDialog} from "@hooks/useConfirmDialog";
import {useFaultTrees} from "@hooks/useFaultTrees";

interface Props {
    faultTree: FaultTree,
    onClick: (any) => void,
}

const FaultTreeListItem = ({faultTree, onClick}: Props) => {
    const [contextMenuSelectedTree, setContextMenuSelectedTree] = useState<FaultTree>(null)
    const [contextMenuAnchor, setContextMenuAnchor] = useState<ElementContextMenuAnchor>(contextMenuDefaultAnchor)

    const handleContextMenu = (evt) => {
        setContextMenuSelectedTree(faultTree);
        setContextMenuAnchor({mouseX: evt.pageX, mouseY: evt.pageY,})
    }

    const [showConfirmDialog] = useConfirmDialog();
    const [, , removeTree] = useFaultTrees();

    const handleDelete = (treeToDelete: FaultTree) => {
        showConfirmDialog({
            title: 'Delete Fault Tree',
            explanation: 'Deleting fault tree will delete the whole tree structure. Events will remain. Proceed to delete the tree?',
            onConfirm: () => {
                removeTree(treeToDelete);
            },
        })
    }

    return (
        <React.Fragment>
            <ListItem button onClick={onClick}>
                <ListItemText primary={faultTree.name}/>
                <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={handleContextMenu}>
                        <MoreVertIcon/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>

            <FaultTreeItemContextMenu
                anchorPosition={contextMenuAnchor}
                onEditClick={() => console.log('onEditClick')}
                onDelete={() => handleDelete(contextMenuSelectedTree)}
                onClose={() => setContextMenuAnchor(contextMenuDefaultAnchor)}/>
        </React.Fragment>
    );
}

export default FaultTreeListItem;
