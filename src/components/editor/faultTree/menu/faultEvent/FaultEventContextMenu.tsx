import { Menu, MenuItem } from "@mui/material";
import * as React from "react";
import { EventType } from "@models/eventModel";
import { ElementContextMenuAnchor } from "@utils/contextMenu";

interface Props {
  eventType: EventType;
  isRootEvent: boolean;
  anchorPosition: ElementContextMenuAnchor;
  onCopyEventClick: () => void;
  pasteAllowed: boolean;
  copiedNodes: string[];
  onPasteEventClick: (iris: string[]) => void;
  onNewEventClick: () => void;
  onEventDelete: () => void;
  onClose: () => void;
}

const FaultEventContextMenu = ({
  eventType,
  isRootEvent,
  anchorPosition,
  onClose,
  onCopyEventClick,
  pasteAllowed,
  copiedNodes,
  onPasteEventClick,
  onNewEventClick,
  onEventDelete,
}: Props) => {
  const handleCopyEventClick = () => {
    onClose();
    onCopyEventClick();
  };

  const handlePasteEventClick = () => {
    onClose();
    onPasteEventClick(copiedNodes);
  };

  const handleNewEventClick = () => {
    onClose();
    onNewEventClick();
  };

  const handleDeleteClick = () => {
    onClose();
    onEventDelete();
  };

  return (
    <Menu
      keepMounted
      open={anchorPosition.mouseY !== null}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={
        anchorPosition.mouseY !== null && anchorPosition.mouseX !== null
          ? {
              top: anchorPosition.mouseY,
              left: anchorPosition.mouseX,
            }
          : undefined
      }
    >
      <MenuItem key="event-menu-new-event" onClick={handleCopyEventClick}>
        Copy
      </MenuItem>

      <MenuItem
        key="event-menu-new-event"
        disabled={!pasteAllowed || !copiedNodes || !copiedNodes.length}
        onClick={handlePasteEventClick}
      >
        Paste
      </MenuItem>
      <hr />

      {eventType === EventType.INTERMEDIATE && (
        <MenuItem key="event-menu-new-event" onClick={handleNewEventClick}>
          New Event
        </MenuItem>
      )}
      {!isRootEvent && (
        <MenuItem key="event-menu-delete" onClick={handleDeleteClick}>
          Delete
        </MenuItem>
      )}
    </Menu>
  );
};

export default FaultEventContextMenu;
