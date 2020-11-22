import {Menu, MenuItem} from "@material-ui/core";
import * as React from "react";
import {ElementContextMenuAnchor} from "../../../../../utils/contextMenu";

interface Props {
    anchorPosition: ElementContextMenuAnchor,
    onEditClick: () => void,
    onComponentCreate: () => void,
    onComponentDelete: () => void,
    createOnly: boolean,
    onClose: () => void,
}

const ComponentContextMenu = ({anchorPosition, onClose, onEditClick, onComponentDelete, onComponentCreate, createOnly}: Props) => {
    const handleCreateClick = () => {
        onClose()
        onComponentCreate()
    }

    const handleEditClick = () => {
        onClose()
        onEditClick()
    }

    const handleDeleteClick = () => {
        onClose()
        onComponentDelete()
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
            <MenuItem key="component-create" onClick={handleCreateClick}>Create</MenuItem>
            {!createOnly && <MenuItem key="component-edit" onClick={handleEditClick}>Edit</MenuItem>}
            {!createOnly && <MenuItem key="component-delete" onClick={handleDeleteClick}>Delete</MenuItem>}
        </Menu>
    );
}

export default ComponentContextMenu;