import * as React from "react";
import { Menu, MenuItem } from "@mui/material";
import { ElementContextMenuAnchor } from "../../../../../utils/contextMenu";
import { useTranslation } from "react-i18next";

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
  renameTooltip,
  deleteTooltip,
}: Props) => {
  const { t } = useTranslation();
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
      <span title={renameTooltip ? renameTooltip : t("common.rename")}>
        <MenuItem disabled={!canRename} key="fault-tree-menu-rename" onClick={handleEditClick}>
          {t("common.rename")}
        </MenuItem>
      </span>
      <span title={deleteTooltip ? deleteTooltip : t("common.delete")}>
        <MenuItem key="fault-tree-delete" onClick={handleDeleteClick}>
          {t("common.delete")}
        </MenuItem>
      </span>
    </Menu>
  );
};

export default FaultTreeContextMenu;
