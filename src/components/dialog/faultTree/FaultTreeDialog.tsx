import * as React from "react";

import { Button, Dialog, TextField } from "@mui/material";
import { DialogTitle } from "@components/materialui/dialog/DialogTitle";
import { DialogContent } from "@components/materialui/dialog/DialogContent";
import { useForm } from "react-hook-form";
import { schema } from "@components/dialog/faultTree/FaultTreeDialog.schema";
import { eventFromHookFormValues } from "@services/faultEventService";
import { useState } from "react";
import { DialogActions } from "@components/materialui/dialog/DialogActions";
import FaultEventCreation from "@components/dialog/faultEvent/FaultEventCreation";
import { useFaultTrees } from "@hooks/useFaultTrees";
import { FaultTree } from "@models/faultTreeModel";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema as eventSchema } from "@components/dialog/faultEvent/FaultEventCreation.schema";
import { FaultEventsReuseProvider } from "@hooks/useReusableFaultEvents";
import { useTranslation } from "react-i18next";
import { SELECTED_SYSTEM } from "@utils/constants";

const FaultTreeDialog = ({ open, handleCloseDialog }) => {
  const { t } = useTranslation();

  const [, addFaultTree] = useFaultTrees();
  const [processing, setIsProcessing] = useState(false);

  const useFormMethods = useForm({ resolver: yupResolver(schema.concat(eventSchema)) });
  const { handleSubmit, register } = useFormMethods;

  const handleCreateFaultTree = async (values: any) => {
    setIsProcessing(true);

    const rootEvent = eventFromHookFormValues(values);

    const faultTree = {
      name: values.faultTreeName,
      manifestingEvent: rootEvent,
    } as FaultTree;

    await addFaultTree(faultTree);

    setIsProcessing(false);
    handleCloseDialog();
  };

  return (
    <div>
      <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth>
        <DialogTitle id="form-dialog-title" onClose={handleCloseDialog}>
          {t("newFtaModal.title")}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            defaultValue={sessionStorage.getItem(SELECTED_SYSTEM) ? sessionStorage.getItem(SELECTED_SYSTEM) : null}
            margin="dense"
            label={t("newFtaModal.namePlaceholder")}
            name="faultTreeName"
            type="text"
            fullWidth
            error={!!useFormMethods.formState.errors.faultTreeName}
            {...register("faultTreeName")}
            helperText={useFormMethods.formState.errors.faultTreeName?.message}
          />
          <FaultEventsReuseProvider>
            <FaultEventCreation useFormMethods={useFormMethods} eventReusing />
          </FaultEventsReuseProvider>
        </DialogContent>
        <DialogActions>
          <Button disabled={processing} color="primary" onClick={handleSubmit(handleCreateFaultTree)}>
            {t("newFtaModal.create")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FaultTreeDialog;
