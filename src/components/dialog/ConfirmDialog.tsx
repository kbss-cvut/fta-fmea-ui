import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { DialogTitle } from "@components/materialui/dialog/DialogTitle";
import { DialogContent } from "@components/materialui/dialog/DialogContent";
import { DialogActions } from "@components/materialui/dialog/DialogActions";
import { useTranslation } from "react-i18next";

interface Props {
  title: string;
  explanation: string;
  onConfirm: () => void;
  open: boolean;
  onClose: () => void;
}

const ConfirmDialog = ({ title, explanation, open, onClose, onConfirm }: Props) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="confirm-dialog">
      <DialogTitle id="confirm-dialog" onClose={onClose}>
        {title}
      </DialogTitle>
      <DialogContent>{explanation}</DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button
          color="primary"
          onClick={() => {
            onClose();
            onConfirm();
          }}
        >
          {t("common.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmDialog;
