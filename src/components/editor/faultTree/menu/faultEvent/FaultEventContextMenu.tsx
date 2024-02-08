import {Menu, MenuItem} from "@mui/material";
import * as React from "react";
import {EventType} from "@models/eventModel";
import {ElementContextMenuAnchor} from "@utils/contextMenu";

interface Props {
    eventType: EventType,
    isRootEvent: boolean,
    anchorPosition: ElementContextMenuAnchor,
    onNewEventClick: () => void,
    onEventDelete: () => void,
    onClose: () => void,
}

const FaultEventContextMenu = ({eventType, isRootEvent, anchorPosition, onClose, onNewEventClick, onEventDelete}: Props) => {
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
            {eventType === EventType.INTERMEDIATE &&
            <MenuItem key="event-menu-new-event" onClick={handleNewEventClick}>New Event</MenuItem>}
            {!isRootEvent &&
            <MenuItem key="event-menu-delete" onClick={handleDeleteClick}>Delete</MenuItem>
            }
        </Menu>
    );
}

export default FaultEventContextMenu;