import * as React from "react";

import { Button, Dialog } from "@mui/material";
import { DialogTitle } from "@components/materialui/dialog/DialogTitle";
import { DialogContent } from "@components/materialui/dialog/DialogContent";
import { DialogActions } from "@components/materialui/dialog/DialogActions";
import * as faultEventService from "@services/faultEventService";
import { SnackbarType, useSnackbar } from "@hooks/useSnackbar";
import FaultEventCreation from "./FaultEventCreation";
import { useForm } from "react-hook-form";
import { schema } from "./FaultEventCreation.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { eventFromHookFormValues } from "@services/faultEventService";
import { FaultEventsReuseProvider } from "@hooks/useReusableFaultEvents";
import { FaultEvent } from "@models/eventModel";

interface Props {
  open: boolean;
  eventIri: string;
  treeUri: string;
  onCreated: (element: FaultEvent) => void;
  onClose: () => void;
}

const FaultEventDialog = ({ open, eventIri, treeUri, onCreated, onClose }: Props) => {
  const [showSnackbar] = useSnackbar();

  const useFormMethods = useForm({ resolver: yupResolver(schema) });
  const { handleSubmit, formState } = useFormMethods;
  const { isSubmitting } = formState;

  const handleCreateEvent = async (values: any) => {
    const requestEvent = eventFromHookFormValues(values);

    faultEventService
      .addEvent(eventIri, requestEvent)
      .then((value) => {
        onClose();
        onCreated(value);
      })
      .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth>
        <DialogTitle id="form-dialog-title" onClose={onClose}>
          Create Event
        </DialogTitle>
        <DialogContent dividers>
          <FaultEventsReuseProvider treeUri={treeUri}>
            <FaultEventCreation useFormMethods={useFormMethods} eventReusing={true} />
          </FaultEventsReuseProvider>
        </DialogContent>
        <DialogActions>
          <Button disabled={isSubmitting} color="primary" onClick={handleSubmit(handleCreateEvent)}>
            Create Event
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FaultEventDialog;
