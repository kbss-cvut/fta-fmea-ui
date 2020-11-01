import * as React from "react";

import {Button, Dialog} from "@material-ui/core";
import {DialogTitle} from "@components/dialog/custom/DialogTitle";
import {DialogContent} from "@components/dialog/custom/DialogContent";
import {CreateGate} from "@models/eventModel";
import {useState} from "react";
import {DialogActions} from "@components/dialog/custom/DialogActions";
import * as eventService from "@services/eventService"
import {SnackbarType} from "@hooks/useSnackbar";
import GateCreation from "@components/dialog/gate/GateCreation";
import {useForm} from "react-hook-form";

type GateDialogProps = {
    treeNodeIri: string,
    onGateCreated: (TreeNode) => void,
    onClose: () => void,
    showSnackbar: (string, SnackbarType) => void
};
// useSnackbar() cannot be used as shapes are rendered within Portal

const GateDialog = ({treeNodeIri, onGateCreated, onClose, showSnackbar}: GateDialogProps) => {
    const [processing, setIsProcessing] = useState(false)

    const useFormMethods = useForm();
    const {handleSubmit} = useFormMethods;

    const handleCreateGate = async (values: any) => {
        setIsProcessing(true)

        eventService.insertGate(treeNodeIri, {gateType: values.gateType} as CreateGate)
            .then(value => onGateCreated(value))
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
            .finally(() => {
                setIsProcessing(false)
                onClose()
            })
    }

    return (
        <div>
            <Dialog open={true} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth={"xs"} fullWidth>
                <DialogTitle id="form-dialog-title" onClose={onClose}>Create Gate</DialogTitle>
                <DialogContent dividers>
                    <GateCreation useFormMethods={useFormMethods}/>
                </DialogContent>
                <DialogActions>
                    <Button disabled={processing} color="primary" onClick={handleSubmit(handleCreateGate)}>
                        Create Gate
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default GateDialog;