import * as React from "react";
import {Menu, MenuItem} from "@material-ui/core";
import {ElementContextMenuAnchor} from "@utils/contextMenu";

interface Props {
    anchorPosition: ElementContextMenuAnchor,
    onRenameClick: () => void,
    onDelete: () => void,
    onClose: () => void,
}

// TODO reuse context menus
const FailureModeTableContextMenu = ({anchorPosition, onClose, onRenameClick, onDelete}: Props) => {

    const handleRenameClick = () => {
        onClose()
        onRenameClick()
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
            <MenuItem key="failuremode-menu-rename" onClick={handleRenameClick}>Rename</MenuItem>
            <MenuItem key="failuremode-delete" onClick={handleDeleteClick}>Delete</MenuItem>
        </Menu>
    );
}

export default FailureModeTableContextMenu;