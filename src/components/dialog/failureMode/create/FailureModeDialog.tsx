import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import {DialogTitle} from "../../../materialui/dialog/DialogTitle";
import {DialogContent} from "../../../materialui/dialog/DialogContent";
import FailureModeStepper from "./FailureModeStepper";
import {useEventFailureMode} from "@hooks/useEventFailureMode";
import * as faultEventService from "@services/faultEventService";
import {useSnackbar, SnackbarType} from "@hooks/useSnackbar";
import {FailureMode} from "@models/failureModeModel";

interface Props {
    open: boolean,
    onClose: () => void,
    eventIri: string,
}

const FailureModeDialog = ({open, onClose, eventIri}: Props) => {
    const [, , refreshFailureMode] = useEventFailureMode();
    const [showSnackbar] = useSnackbar();

    const handleConfirmationClick = (failureMode: FailureMode) => {
        faultEventService.addFailureMode(eventIri, failureMode)
            .then(value => {
                showSnackbar('Failure Mode Created', SnackbarType.SUCCESS)
                refreshFailureMode()
                onClose()
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="failure-mode-dialog" fullWidth maxWidth="lg">
            <DialogTitle id="failure-mode-dialog" onClose={onClose}>Create Failure Mode</DialogTitle>
            <DialogContent dividers>
                <FailureModeStepper onConfirmationClick={handleConfirmationClick} buttonTitle="Create"/>
            </DialogContent>
        </Dialog>
    );
};
export default FailureModeDialog;