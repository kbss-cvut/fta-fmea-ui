import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import {DialogTitle} from "../../../materialui/dialog/DialogTitle";
import {DialogContent} from "../../../materialui/dialog/DialogContent";
import {FailureMode} from "@models/failureModeModel";
import FailureModeStepperConfirmation from "../create/FailureModeStepperConfirmation";
import {find, flatten} from "lodash";

interface Props {
    open: boolean,
    onClose: () => void,
    failureMode: FailureMode,
}

const FailureModeShowDialog = ({open, onClose, failureMode}: Props) => {
    // resolve references from component functions
    const componentFunctions = failureMode?.influencedFunctions?.map(modeFunction => {
        return find(flatten([failureMode?.component?.functions]), (f) => f?.iri === modeFunction?.iri)
    })

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="failure-mode-show-dialog" fullWidth maxWidth="lg">
            <DialogTitle id="failure-mode-show-dialog" onClose={onClose}>Failure Mode Overview</DialogTitle>
            <DialogContent dividers>
                {failureMode &&
                <FailureModeStepperConfirmation
                    component={failureMode?.component}
                    componentFunctions={componentFunctions}
                    failureMode={failureMode}
                    mitigation={failureMode?.mitigation}
                />
                }
            </DialogContent>
        </Dialog>
    );
};
export default FailureModeShowDialog;