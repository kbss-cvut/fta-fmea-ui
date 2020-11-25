import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import {DialogTitle} from "../../../materialui/dialog/DialogTitle";
import {DialogContent} from "../../../materialui/dialog/DialogContent";
import FailureModeStepper from "./FailureModeStepper";
import {useEventFailureMode} from "@hooks/useEventFailureMode";

interface Props {
    open: boolean,
    onClose: () => void,
    eventIri: string,
}

const FailureModeDialog = ({open, onClose, eventIri}: Props) => {
    const [,,refreshFailureMode] = useEventFailureMode();
    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="failure-mode-dialog" fullWidth maxWidth="lg">
            <DialogTitle id="failure-mode-dialog" onClose={onClose}>Create Failure Mode</DialogTitle>
            <DialogContent dividers>
                <FailureModeStepper onClose={onClose} eventIri={eventIri} onFailureModeCreated={refreshFailureMode}/>
            </DialogContent>
        </Dialog>
    );
};
export default FailureModeDialog;