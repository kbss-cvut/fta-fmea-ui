import * as React from "react";

import {Button, Dialog, TextField,} from "@mui/material";
import {DialogTitle} from "../../../materialui/dialog/DialogTitle";
import {DialogContent} from "../../../materialui/dialog/DialogContent";
import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {DialogActions} from "../../../materialui/dialog/DialogActions";
import {yupResolver} from "@hookform/resolvers/yup";
import {useFailureModesTables} from "@hooks/useFailureModesTables";
import {FailureModesTable, UpdateFailureModesTable} from "@models/failureModesTableModel";
import {schema} from "@components/dialog/failureModesTable/FailureModesTableDialog.schema";

interface Props {
    open: boolean,
    handleCloseDialog: () => void,
    failureModesTable: FailureModesTable
}

const FailureModesTableRenameDialog = ({open, handleCloseDialog, failureModesTable}: Props) => {
    const [, updateTable] = useFailureModesTables()
    const [processing, setIsProcessing] = useState(false)

    const useFormMethods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {fmeaName: failureModesTable?.name}
    });
    const {handleSubmit, reset} = useFormMethods;

    useEffect(() => {
        reset({
            fmeaName: failureModesTable?.name
        })
    }, [failureModesTable])

    const handleRenameFailureModesTable = async (values: any) => {
        setIsProcessing(true)

        const tableUpdate = {
            uri: failureModesTable.iri,
            name: values.fmeaName,
        } as UpdateFailureModesTable

        await updateTable(tableUpdate)

        setIsProcessing(false)
        handleCloseDialog()
    }

    return (
        <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="failuremodes-table-rename-dialog-title" maxWidth="md"
                fullWidth>
            <DialogTitle id="failuremodes-table-edit-dialog-title" onClose={handleCloseDialog}>Rename Failure Modes Table</DialogTitle>
            <DialogContent dividers>
                <TextField autoFocus margin="dense" label="Failure Modes Table Name" name="fmeaName" type="text"
                           fullWidth inputRef={useFormMethods.register}
                           error={!!useFormMethods.formState.errors.fmeaName}/>
            </DialogContent>
            <DialogActions>
                <Button disabled={processing} color="primary" onClick={handleSubmit(handleRenameFailureModesTable)}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FailureModesTableRenameDialog;