import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import {DialogTitle} from "../../../materialui/dialog/DialogTitle";
import {DialogContent} from "../../../materialui/dialog/DialogContent";
import FailureModeStepper from "./FailureModeStepper";
import {RootToLeafEventPathProvider} from "../../../../hooks/useRootToLeafPath";
import {useCurrentFaultTree} from "../../../../hooks/useCurrentFaultTree";

interface Props {
    open: boolean,
    onClose: () => void,
    leafEventIri: string,
}

const FailureModeDialog = ({open, onClose, leafEventIri}: Props) => {
    const [faultTree,] = useCurrentFaultTree();

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="failure-mode-dialog" fullWidth maxWidth="lg">
            <DialogTitle id="failure-mode-dialog" onClose={onClose}>Create Failure Mode</DialogTitle>
            <DialogContent dividers>
                <RootToLeafEventPathProvider faultTreeIri={faultTree?.iri} leafEventIri={leafEventIri}>
                    <FailureModeStepper onClose={onClose}/>
                </RootToLeafEventPathProvider>
            </DialogContent>
        </Dialog>
    );
};
export default FailureModeDialog;