import * as React from "react";

import { Button, Dialog, TextField } from "@mui/material";
import { DialogTitle } from "@components/materialui/dialog/DialogTitle";
import { DialogContent } from "@components/materialui/dialog/DialogContent";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { DialogActions } from "@components/materialui/dialog/DialogActions";
import { yupResolver } from "@hookform/resolvers/yup";
import { System } from "@models/systemModel";
import { useSystems } from "@hooks/useSystems";
import { schema } from "./SystemDialog.schema";

interface Props {
  open: boolean;
  handleCloseDialog: () => void;
  system: System;
}

const SystemEditDialog = ({ open, handleCloseDialog, system }: Props) => {
  const [, , updateSystem] = useSystems();
  const [processing, setIsProcessing] = useState(false);

  const useFormMethods = useForm({
    resolver: yupResolver(schema),
    defaultValues: { systemName: system?.name },
  });
  const { handleSubmit, reset, register } = useFormMethods;

  useEffect(() => {
    reset({
      systemName: system?.name,
    });
  }, [system]);

  const handleUpdateSystem = async (values: any) => {
    setIsProcessing(true);

    system.name = values.systemName;
    await updateSystem(system);

    reset({
      systemName: values.systemName,
    });
    setIsProcessing(false);
    handleCloseDialog();
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="system-edit-dialog-title" maxWidth="md" fullWidth>
      <DialogTitle id="system-edit-dialog-title" onClose={handleCloseDialog}>
        Edit System
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          autoFocus
          margin="dense"
          label="System Name"
          name="systemName"
          type="text"
          fullWidth
          {...register("systemName")}
          error={!!useFormMethods.formState.errors.systemName}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={processing} color="primary" onClick={handleSubmit(handleUpdateSystem)}>
          Save System
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SystemEditDialog;
