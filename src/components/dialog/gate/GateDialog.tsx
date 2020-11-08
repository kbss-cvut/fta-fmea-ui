import * as React from "react";

import {Button, Dialog} from "@material-ui/core";
import {DialogTitle} from "@components/dialog/custom/DialogTitle";
import {DialogContent} from "@components/dialog/custom/DialogContent";
import {CreateGate} from "@models/eventModel";
import {useState} from "react";
import {DialogActions} from "@components/dialog/custom/DialogActions";
import * as eventService from "@services/eventService"
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import GateCreation from "@components/dialog/gate/GateCreation";
import {useForm} from "react-hook-form";
import {EventDialogProps} from "@components/dialog/EventDialog";

const GateDialog = ({open, nodeIri, onCreated, onClose}: EventDialogProps) => {
    const [showSnackbar] = useSnackbar()

    const useFormMethods = useForm();
    const {handleSubmit, formState} = useFormMethods;
    const {isSubmitting} = formState;

    const handleCreateGate = async (values: any) => {
        eventService.insertGate(nodeIri, {gateType: values.gateType} as CreateGate)
            .then(value => {
                onClose()
                onCreated(value)
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    return (
        <div>
            <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth={"xs"} fullWidth>
                <DialogTitle id="form-dialog-title" onClose={onClose}>Create Gate</DialogTitle>
                <DialogContent dividers>
                    <GateCreation useFormMethods={useFormMethods}/>
                </DialogContent>
                <DialogActions>
                    <Button disabled={isSubmitting} color="primary" onClick={handleSubmit(handleCreateGate)}>
                        Create Gate
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default GateDialog;