import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import {DialogTitle} from "../../../materialui/dialog/DialogTitle";
import {DialogContent} from "../../../materialui/dialog/DialogContent";
import {FailureMode} from "@models/failureModeModel";
import * as failureModeService from "@services/failureModeService";
import {find, flatten} from "lodash";
import FailureModeStepper from "@components/dialog/failureMode/create/FailureModeStepper";
import {useEventFailureMode} from "@hooks/useEventFailureMode";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";

interface Props {
    open: boolean,
    onClose: () => void,
    failureMode: FailureMode,
}

const FailureModeShowDialog = ({open, onClose, failureMode}: Props) => {
    const [, , refreshFailureMode] = useEventFailureMode();
    const [showSnackbar] = useSnackbar();

    // resolve references from component functions
    const componentFunctions = flatten([failureMode?.influencedFunctions])?.map(modeFunction => {
        return find(flatten([failureMode?.component?.functions]), (f) => f?.iri === modeFunction?.iri)
    })

    const handleSaveClicked = (failureMode: FailureMode) => {
        failureModeService.update(failureMode)
            .then(value => {
                showSnackbar('Failure Mode Updated', SnackbarType.SUCCESS)
                refreshFailureMode()
                onClose()
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR));
    }

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="failure-mode-show-dialog" fullWidth maxWidth="lg">
            <DialogTitle id="failure-mode-show-dialog" onClose={onClose}>Failure Mode Overview</DialogTitle>
            <DialogContent dividers>
                {failureMode && <FailureModeStepper
                    buttonTitle="Save" onConfirmationClick={handleSaveClicked}
                    initialFailureMode={failureMode} initialComponent={failureMode?.component}
                    initialFunctions={componentFunctions} initialMitigation={failureMode?.mitigation}
                />}
            </DialogContent>
        </Dialog>
    );
};
export default FailureModeShowDialog;