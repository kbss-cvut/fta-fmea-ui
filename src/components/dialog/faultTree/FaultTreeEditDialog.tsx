import * as React from "react";

import { Button, Dialog, TextField } from "@mui/material";
import { DialogTitle } from "@components/materialui/dialog/DialogTitle";
import { DialogContent } from "@components/materialui/dialog/DialogContent";
import { useForm } from "react-hook-form";
import { schema } from "@components/dialog/faultTree/FaultTreeDialog.schema";
import { useEffect, useState } from "react";
import { DialogActions } from "@components/materialui/dialog/DialogActions";
import { useFaultTrees } from "@hooks/useFaultTrees";
import { FaultTree } from "@models/faultTreeModel";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  handleCloseDialog: () => void;
  faultTree: FaultTree;
}

const FaultTreeEditDialog = ({ open, handleCloseDialog, faultTree }: Props) => {
  const { t } = useTranslation();
  const [, , updateTree] = useFaultTrees();
  const [processing, setIsProcessing] = useState(false);

  const useFormMethods = useForm({
    resolver: yupResolver(schema),
    defaultValues: { faultTreeName: faultTree?.name },
  });
  const { handleSubmit, reset } = useFormMethods;

  useEffect(() => {
    reset({
      faultTreeName: faultTree?.name,
    });
  }, [faultTree]);

  const handleCreateFaultTree = async (values: any) => {
    setIsProcessing(true);

    await updateTree(
      Object.assign({}, faultTree, { name: values.faultTreeName }),
      () => (faultTree.name = values.faultTreeName),
      () =>
        reset({
          faultTreeName: faultTree.name,
        }),
    );

    setIsProcessing(false);
    handleCloseDialog();
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="tree-edit-dialog-title" maxWidth="md" fullWidth>
      <DialogTitle id="tree-edit-dialog-title" onClose={handleCloseDialog}>
        {t("renameFtaModal.title")}
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          autoFocus
          margin="dense"
          label={t("renameFtaModal.nameFieldLabel")}
          name="faultTreeName"
          type="text"
          fullWidth
          {...useFormMethods.register("faultTreeName")}
          error={!!useFormMethods.formState.errors.faultTreeName}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={processing} color="primary" onClick={handleSubmit(handleCreateFaultTree)}>
          {t("common.rename")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FaultTreeEditDialog;
