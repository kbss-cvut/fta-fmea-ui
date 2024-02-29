import * as React from "react";
import { Menu, MenuItem } from "@mui/material";
import { ElementContextMenuAnchor } from "@utils/contextMenu";

interface Props {
  anchorPosition: ElementContextMenuAnchor;
  onEditClick: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const SystemContextMenu = ({ anchorPosition, onClose, onEditClick, onDelete }: Props) => {
  const handleEditClick = () => {
    onClose();
    onEditClick();
  };

  const handleDeleteClick = () => {
    onClose();
    onDelete();
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
      <MenuItem key="system-menu-rename" onClick={handleEditClick}>
        Rename
      </MenuItem>
      <MenuItem key="system-delete" onClick={handleDeleteClick}>
        Delete
      </MenuItem>
    </Menu>
  );
};

export default SystemContextMenu;
