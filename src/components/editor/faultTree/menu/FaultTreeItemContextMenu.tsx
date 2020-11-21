import * as React from "react";
import {Menu, MenuItem} from "@material-ui/core";
import {ElementContextMenuAnchor} from "./ElementContextMenu";

interface Props {
    anchorPosition: ElementContextMenuAnchor,
    onEditClick: () => void,
    onDelete: () => void,
    onClose: () => void,
}

const FaultTreeItemContextMenu = ({anchorPosition, onClose, onEditClick, onDelete}: Props) => {

    const handleEditClick = () => {
        onClose()
        onEditClick()
    }

    const handleDeleteClick = () => {
        onClose()
        onDelete()
    }

    return (
        <Menu
            keepMounted
            open={anchorPosition.mouseY !== null}
            onClose={onClose}
            anchorReference="anchorPosition"
            anchorPosition={
                anchorPosition.mouseY !== null && anchorPosition.mouseX !== null ? {
                    top: anchorPosition.mouseY,
                    left: anchorPosition.mouseX
                } : undefined
            }
        >
            <MenuItem key="fault-tree-menu-rename" onClick={handleEditClick}>Rename</MenuItem>
            <MenuItem key="fault-tree-delete" onClick={handleDeleteClick}>Delete</MenuItem>
        </Menu>
    );
}

export default FaultTreeItemContextMenu;