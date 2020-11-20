import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import {DialogTitle} from "@components/materialui/dialog/DialogTitle";
import {DialogContent} from "@components/materialui/dialog/DialogContent";
import FailureModeStepper from "./FailureModeStepper";
import {EventPathToRootProvider} from "@hooks/useEventPathToRoot";

interface Props {
    open: boolean,
    onClose: () => void,
    leafEventIri: string,
}

const FailureModeDialog = ({open, onClose, leafEventIri}: Props) => {
    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="failure-mode-dialog" fullWidth maxWidth="lg">
            <DialogTitle id="failure-mode-dialog" onClose={onClose}>Create Failure Mode</DialogTitle>
            <DialogContent dividers>
                <EventPathToRootProvider leafEventIri={leafEventIri}>
                    <FailureModeStepper onClose={onClose}/>
                </EventPathToRootProvider>
            </DialogContent>
        </Dialog>
    );
};
export default FailureModeDialog;