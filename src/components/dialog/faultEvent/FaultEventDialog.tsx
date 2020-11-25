import * as React from "react";

import {Button, Dialog,} from "@material-ui/core";
import {DialogTitle} from "@components/materialui/dialog/DialogTitle";
import {DialogContent} from "@components/materialui/dialog/DialogContent";
import {DialogActions} from "@components/materialui/dialog/DialogActions";
import * as faultEventService from "@services/faultEventService";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import FaultEventCreation from "./FaultEventCreation";
import {useForm} from "react-hook-form";
import {schema} from "./FaultEventCreation.schema";
import {yupResolver} from "@hookform/resolvers/yup";
import {eventFromHookFormValues} from "@services/faultEventService";
import {FaultEvent} from "@models/eventModel";
import {FaultEventsProvider} from "@hooks/useFaultEvents";

interface Props {
    open: boolean,
    eventIri: string,
    onCreated: () => void,
    onClose: () => void,
}

const FaultEventDialog = ({open, eventIri, onCreated, onClose}: Props) => {
    const [showSnackbar] = useSnackbar()

    const useFormMethods = useForm({resolver: yupResolver(schema)});
    const {handleSubmit, formState} = useFormMethods;
    const {isSubmitting} = formState

    const handleCreateEvent = async (values: any) => {
        const requestEvent = eventFromHookFormValues(values);

        faultEventService.addEvent(eventIri, requestEvent)
            .then(value => {
                onClose()
                onCreated()
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    return (
        <div>
            <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth>
                <DialogTitle id="form-dialog-title" onClose={onClose}>Create Event</DialogTitle>
                <DialogContent dividers>
                    <FaultEventsProvider>
                        <FaultEventCreation useFormMethods={useFormMethods} eventReusing={true}/>
                    </FaultEventsProvider>
                </DialogContent>
                <DialogActions>
                    <Button disabled={isSubmitting} color="primary" onClick={handleSubmit(handleCreateEvent)}>
                        Create Event
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default FaultEventDialog;