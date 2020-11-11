import {Menu, MenuItem} from "@material-ui/core";
import * as React from "react";
import {TreeNodeType} from "@models/treeNodeModel";

export interface ElementContextMenuAnchor {
    mouseX: null | number,
    mouseY: null | number,
}

interface Props {
    anchorPosition: ElementContextMenuAnchor,
    eventType: TreeNodeType,
    onEditClick: () => void,
    onNewEventClick: () => void,
    onEventDelete: () => void,
    onClose: () => void,
}

const ElementContextMenu = ({anchorPosition, eventType, onClose, onEditClick, onNewEventClick, onEventDelete}: Props) => {

    const handleEditClick = () => {
        onClose()
        onEditClick()
    }

    const handleNewEventClick = () => {
        onClose()
        onNewEventClick()
    }

    const handleDeleteClick = () => {
        onClose()
        onEventDelete()
    }


    let newEventTitle;
    switch(eventType) {
        case TreeNodeType.EVENT:
            newEventTitle = "New Gate"
            break;
        case TreeNodeType.GATE:
            newEventTitle = "New Event"
            break;
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
            <MenuItem key="event-menu-edit" onClick={handleEditClick}>Edit</MenuItem>
            <MenuItem key="event-menu-new-gate" onClick={handleNewEventClick}>{newEventTitle}</MenuItem>
            <MenuItem key="event-menu-delete" onClick={handleDeleteClick}>Delete</MenuItem>
        </Menu>
    );
}

export default ElementContextMenu;