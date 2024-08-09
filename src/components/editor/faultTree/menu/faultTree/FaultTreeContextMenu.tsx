import * as React from "react";
import { Menu, MenuItem } from "@mui/material";
import { ElementContextMenuAnchor } from "../../../../../utils/contextMenu";

interface Props {
  anchorPosition: ElementContextMenuAnchor;
  onEditClick: () => void;
  onDelete: () => void;
  onClose: () => void;
  canRename: boolean;
}

const FaultTreeContextMenu = ({ anchorPosition, onClose, onEditClick, onDelete, canRename }: Props) => {
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
      <MenuItem disabled={!canRename} key="fault-tree-menu-rename" onClick={handleEditClick}>
        Rename
      </MenuItem>
      <MenuItem key="fault-tree-delete" onClick={handleDeleteClick}>
        Delete
      </MenuItem>
    </Menu>
  );
};

export default FaultTreeContextMenu;
