import React, { useEffect } from "react";
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
import { rootEventSchema } from "@components/dialog/faultEvent/FaultEventCreation.schema";
import { ReusableFaultEventsProvider } from "@hooks/useReusableFaultEvents";
import { useTranslation } from "react-i18next";
import useStyles from "@components/dialog/faultTree/FaultTreeDialog.styles";
import {useSelectedSystem} from "@hooks/useSelectedSystem";

const FaultTreeDialog = ({ open, handleCloseDialog }) => {
  const { t } = useTranslation();
  const { classes } = useStyles();

  const [, addFaultTree] = useFaultTrees();
  const [processing, setIsProcessing] = useState(false);
  const [selectedSystem] = useSelectedSystem();

  const useFormMethods = useForm({ resolver: yupResolver(schema.concat(rootEventSchema)) });
  const { handleSubmit, register } = useFormMethods;

  const handleCreateFaultTree = async (values: any) => {
    setIsProcessing(true);

    const rootEvent = eventFromHookFormValues(values);

    // TODO: Add full system from System Context Provider
    const faultTree = {
      name: rootEvent.name,
      system: selectedSystem,
      manifestingEvent: rootEvent,
    } as FaultTree;

    await addFaultTree(faultTree);

    setIsProcessing(false);
    handleCloseDialog();
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth>
      <DialogTitle id="form-dialog-title" onClose={handleCloseDialog}>
        {t("newFtaModal.title")}
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          className={classes.readOnly}
          value={selectedSystem?.name}
          aria-readonly={true}
          margin="dense"
          label={t("newFtaModal.namePlaceholder")}
          name="faultTreeName"
          type="text"
          fullWidth
          error={!!useFormMethods.formState.errors.faultTreeName}
          {...register("faultTreeName")}
          helperText={!!useFormMethods.formState.errors.faultTreeName && t("newFtaModal.noSystemError")}
        />
        <ReusableFaultEventsProvider systemUri={selectedSystem?.iri}>
          <FaultEventCreation useFormMethods={useFormMethods} isRootEvent={true} />
        </ReusableFaultEventsProvider>
      </DialogContent>
      <DialogActions>
        <Button disabled={processing} color="primary" onClick={handleSubmit(handleCreateFaultTree)}>
          {t("newFtaModal.create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FaultTreeDialog;
