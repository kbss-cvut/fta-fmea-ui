import React from "react";
import { Button, Dialog, DialogTitle, DialogActions } from "@mui/material";
import { useTranslation } from "react-i18next";

interface UnsavedChangesDialogProps {
  isModalOpen: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

const UnsavedChangesDialog: React.FC<UnsavedChangesDialogProps> = ({ isModalOpen, onSave, onDiscard }) => {
  const { t } = useTranslation();
  return (
    <Dialog open={isModalOpen}>
      <DialogTitle style={{ fontSize: 16 }}>{t("faultEventMenu.unsavedChanges")}</DialogTitle>
      <DialogActions>
        <Button onClick={onDiscard} color="primary">
          {t("common.discard")}
        </Button>
        <Button onClick={onSave} color="primary">
          {t("common.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnsavedChangesDialog;
