import {Menu, MenuItem} from "@material-ui/core";
import * as React from "react";
import {EventType} from "@models/eventModel";

export const contextMenuDefaultAnchor = {mouseX: null, mouseY: null,} as ElementContextMenuAnchor;

export interface ElementContextMenuAnchor {
    mouseX: null | number,
    mouseY: null | number,
}

interface Props {
    eventType: EventType,
    anchorPosition: ElementContextMenuAnchor,
    onEditClick: () => void,
    onNewEventClick: () => void,
    onEventDelete: () => void,
    onClose: () => void,
}

const ElementContextMenu = ({eventType, anchorPosition, onClose, onEditClick, onNewEventClick, onEventDelete}: Props) => {

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
            {eventType === EventType.INTERMEDIATE &&
            <MenuItem key="event-menu-new-event" onClick={handleNewEventClick}>New Event</MenuItem>}
            <MenuItem key="event-menu-delete" onClick={handleDeleteClick}>Delete</MenuItem>
        </Menu>
    );
}

export default ElementContextMenu;