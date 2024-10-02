import * as React from "react";
import { Menu, MenuItem } from "@mui/material";
import { ElementContextMenuAnchor } from "@utils/contextMenu";
import { useTranslation } from "react-i18next";

interface Props {
  anchorPosition: ElementContextMenuAnchor;
  onEditClick: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const SystemContextMenu = ({ anchorPosition, onClose, onEditClick, onDelete }: Props) => {
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
      <MenuItem key="system-menu-rename" onClick={handleEditClick}>
        {t("common.rename")}
      </MenuItem>
      <MenuItem key="system-delete" onClick={handleDeleteClick}>
        {t("common.delete")}
      </MenuItem>
    </Menu>
  );
};

export default SystemContextMenu;
