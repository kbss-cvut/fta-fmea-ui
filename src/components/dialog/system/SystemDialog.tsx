import * as React from "react";

import { Button, Dialog, TextField } from "@mui/material";
import { DialogTitle } from "@components/materialui/dialog/DialogTitle";
import { DialogContent } from "@components/materialui/dialog/DialogContent";
import { useForm } from "react-hook-form";
import { schema } from "@components/dialog/system/SystemDialog.schema";
import { useState } from "react";
import { DialogActions } from "@components/materialui/dialog/DialogActions";
import { useSystems } from "@hooks/useSystems";
import { System } from "@models/systemModel";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";

const SystemDialog = ({ open, handleCloseDialog }) => {
  const { t } = useTranslation();

  const [, addSystem] = useSystems();
  const [processing, setIsProcessing] = useState(false);

  const useFormMethods = useForm({ resolver: yupResolver(schema) });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useFormMethods;

  const handleCreateSystem = async (values: any) => {
    setIsProcessing(true);

    const system = {
      name: values.systemName,
    } as System;

    await addSystem(system);

    setIsProcessing(false);
    handleCloseDialog();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth>
        <DialogTitle id="form-dialog-title" onClose={handleCloseDialog}>
          {t("newSystemModal.title")}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="dense"
            label={t("newSystemModal.namePlaceholder")}
            name="systemName"
            type="text"
            fullWidth
            error={!!errors.systemName}
            helperText={errors.systemName?.message}
            {...register("systemName")}
          />
        </DialogContent>
        <DialogActions>
          <Button disabled={processing} color="primary" onClick={handleSubmit(handleCreateSystem)}>
            {t("newSystemModal.create")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SystemDialog;
