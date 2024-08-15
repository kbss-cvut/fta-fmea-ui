import * as React from "react";
import { Menu, MenuItem } from "@mui/material";
import { ElementContextMenuAnchor } from "../../../../../utils/contextMenu";

interface Props {
  anchorPosition: ElementContextMenuAnchor;
  onEditClick: () => void;
  onDelete: () => void;
  onClose: () => void;
  canRename: boolean;
  renameTooltip: string;
  deleteTooltip?: string;
}

const FaultTreeContextMenu = ({
  anchorPosition,
  onClose,
  onEditClick,
  onDelete,
  canRename,
  renameTooltip = "rename",
  deleteTooltip = "delete",
}: Props) => {
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
      <span title={renameTooltip}>
        <MenuItem disabled={!canRename} key="fault-tree-menu-rename" onClick={handleEditClick}>
          Rename
        </MenuItem>
      </span>
      <span title={deleteTooltip}>
        <MenuItem key="fault-tree-delete" onClick={handleDeleteClick}>
          Delete
        </MenuItem>
      </span>
    </Menu>
  );
};

export default FaultTreeContextMenu;
