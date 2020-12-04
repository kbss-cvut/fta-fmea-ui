import * as React from "react";

import {Box, Button, Dialog, TextField,} from "@material-ui/core";

import {Controller, useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {yupResolver} from "@hookform/resolvers/yup";
import {DialogTitle} from "../../materialui/dialog/DialogTitle";
import {DialogContent} from "../../materialui/dialog/DialogContent";
import {DialogActions} from "../../materialui/dialog/DialogActions";
import {EditRowRpn} from "@models/failureModesRowModel";
import {schema} from "../faultTree/paths/FaultTreePathRow.schema";
import useStyles from "./FailureModesRowEditDialog.styles";
import * as failureModesRowService from "@services/failureModesRowService";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";

interface Props {
    open: boolean,
    handleCloseDialog: () => void,
    rowRpn: EditRowRpn,
    onSuccess: () => void,
}

const FailureModesRowEditDialog = ({open, handleCloseDialog, rowRpn, onSuccess}: Props) => {
    const classes = useStyles();
    const [showSnackbar] = useSnackbar();

    const initialValues = {
        severity: rowRpn?.severity,
        occurrence: rowRpn?.occurrence,
        detection: rowRpn?.detection,
    };

    const useFormMethods = useForm({
        resolver: yupResolver(schema),
        defaultValues: initialValues
    });
    const {handleSubmit, reset, formState, errors, control} = useFormMethods;
    const {isSubmitting} = formState;

    useEffect(() => {
        reset(initialValues)
    }, [rowRpn])

    const handleRowRpnSave = async (values: any) => {
        const updateRow = {
            uri: rowRpn.uri,
            severity: values.severity,
            occurrence: values.occurrence,
            detection: values.detection,
        } as EditRowRpn

        failureModesRowService
            .update(updateRow)
            .then(value => {
                showSnackbar("RPN updated", SnackbarType.SUCCESS);
                onSuccess();
                handleCloseDialog();
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR));

        handleCloseDialog()
    }

    return (
        <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle id="failuremodes-row-rpn-update-title" onClose={handleCloseDialog}>Update Row RPN</DialogTitle>
            <DialogContent dividers>

                <Box className={classes.rpnBox}>
                    <Controller as={TextField} control={control} label="Severity" type="number" name="severity"
                                InputProps={{inputProps: {min: 1, max: 10, step: 1}}}
                                error={!!errors.severity}
                                className={classes.rpnBoxItem} defaultValue=""
                    />
                    <Controller as={TextField} control={control} label="Occurrence" type="number" name="occurrence"
                                InputProps={{inputProps: {min: 1, max: 10, step: 1}}}
                                error={!!errors.occurrence}
                                className={classes.rpnBoxItem} defaultValue=""
                    />
                    <Controller as={TextField} control={control} label="Detection" type="number" name="detection"
                                InputProps={{inputProps: {min: 1, max: 10, step: 1}}}
                                error={!!errors.detection}
                                className={classes.rpnBoxItem} defaultValue=""
                    />
                </Box>


            </DialogContent>
            <DialogActions>
                <Button disabled={isSubmitting} color="primary" onClick={handleSubmit(handleRowRpnSave)}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FailureModesRowEditDialog;