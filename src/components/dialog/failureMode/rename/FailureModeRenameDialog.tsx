import * as React from "react";

import {Button, Dialog, TextField,} from "@material-ui/core";
import {DialogTitle} from "@components/materialui/dialog/DialogTitle";
import {DialogContent} from "@components/materialui/dialog/DialogContent";
import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {DialogActions} from "@components/materialui/dialog/DialogActions";
import {yupResolver} from "@hookform/resolvers/yup";
import {useSystems} from "@hooks/useSystems";
import {FailureMode} from "@models/failureModeModel";
import {schema} from "../FailureMode.schema";
import {useFailureModes} from "@hooks/useFailureModes";

interface Props {
    open: boolean,
    handleCloseDialog: () => void,
    failureMode: FailureMode
}

const FailureModeRenameDialog = ({open, handleCloseDialog, failureMode}: Props) => {
    const [, updateFailureMode] = useFailureModes()
    const [processing, setIsProcessing] = useState(false)

    const useFormMethods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {name: failureMode?.name}
    });
    const {handleSubmit, reset} = useFormMethods;

    useEffect(() => {
        reset({
            name: failureMode?.name
        })
    }, [failureMode])

    const handleRenameFailureMode = async (values: any) => {
        setIsProcessing(true)

        failureMode.name = values.name;
        await updateFailureMode(failureMode)

        setIsProcessing(false)
        handleCloseDialog()
    }

    return (
        <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="failuremode-rename-dialog-title" maxWidth="md"
                fullWidth>
            <DialogTitle id="failuremode-edit-dialog-title" onClose={handleCloseDialog}>Rename Failure Mode</DialogTitle>
            <DialogContent dividers>
                <TextField autoFocus margin="dense" label="Failure Mode Name" name="name" type="text"
                           fullWidth inputRef={useFormMethods.register}
                           error={!!useFormMethods.errors.name}/>
            </DialogContent>
            <DialogActions>
                <Button disabled={processing} color="primary" onClick={handleSubmit(handleRenameFailureMode)}>
                    Save Failure Mode
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FailureModeRenameDialog;