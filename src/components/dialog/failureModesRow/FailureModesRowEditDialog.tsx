import * as React from "react";

import {
    Box,
    Button,
    Dialog,
    TextField,
} from "@material-ui/core";

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
import * as mitigationService from "@services/mitigationService";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import {Mitigation } from "@models/mitigationModel";
import {FailureMode} from "@models/failureModeModel";
import {useConfirmDialog} from "@hooks/useConfirmDialog";

interface Props {
    open: boolean,
    handleCloseDialog: () => void,
    rowRpn: EditRowRpn,
    onSuccess: () => void,
    mitigation: Mitigation
    failureModes: FailureMode[]
}

const FailureModesRowEditDialog = ({open, handleCloseDialog, rowRpn, onSuccess, mitigation, failureModes}: Props) => {
    const classes = useStyles();
    const [showSnackbar] = useSnackbar();
    const [selectedFailureMode, setSelectedFailureMode] = useState<FailureMode>(null);
    const [showConfirmDialog] = useConfirmDialog();

    const initialValues = {
        severity: rowRpn?.severity,
        occurrence: rowRpn?.occurrence,
        detection: rowRpn?.detection,
        name: mitigation?.name,
        description: mitigation?.description
    };

    const useFormMethods = useForm({
        resolver: yupResolver(schema),
        defaultValues: initialValues
    });
    const {handleSubmit, reset, formState, errors, control} = useFormMethods;
    const {isSubmitting} = formState;

    useEffect(() => {
        reset(initialValues)
    }, [rowRpn, mitigation])

    const handleRowRpnSave = async (values: any) => {
        const updateMit: Mitigation  = {
            name: values?.name,
            description: values?.description,
        }

        if(updateMit.name === "" && updateMit.description !== "") {
            showConfirmDialog({
                title: 'Remove mitigation ?',
                explanation: 'Mitigation will be removed because name must not be empty',
                onConfirm: () => {
                    handleFailureModesRowSave(values, updateMit)
                },
            })
        }else handleFailureModesRowSave(values, updateMit)
    }

    const handleFailureModesRowSave = async (values, updateMit) => {
        let mit;
        if(updateMit.name !== "") await mitigationService.update(updateMit).then(value => mit = value)

        const updateRow = {
            uri: rowRpn.uri,
            severity: values.severity,
            occurrence: values.occurrence,
            detection: values.detection,
            mitigationUri: mit === undefined ? "" : mit.iri,
            failureModeUri: selectedFailureMode?.["@id"]
        } as EditRowRpn

        failureModesRowService
            .update(updateRow)
            .then(value => {
                showSnackbar("Row updated", SnackbarType.SUCCESS);
                onSuccess();
                handleCloseDialog();
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR));

        handleCloseDialog()
        setSelectedFailureMode(null)
    }

    const handleChange = (event) => {
        setSelectedFailureMode(event.target.value)
    }

    return (
        <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle id="failuremodes-row-rpn-update-title" onClose={handleCloseDialog}>Update Row</DialogTitle>
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

                <Box className={classes.mitigationBox}>
                    <Controller as={TextField} control={control} label="Mitigation name" type="text" name="name"
                                className={classes.rpnBoxItem} defaultValue=""/>
                </Box>

                <Box className={classes.mitigationBox}>
                    <Controller as={TextField} control={control} label="Mitigation description" type="text"
                                name="description" multiline rows={5} variant="outlined" className={classes.rpnBoxItem} defaultValue=""/>
                </Box>
                {/*<Box className={classes.mitigationBox}>*/}
                {/*    <InputLabel id="failure-modes-multiselect-label"> Failure Mode </InputLabel>*/}
                {/*    <Select*/}
                {/*        labelId="failure-modes-multiselect-label"*/}
                {/*        id="failure-modes-multiselect"*/}
                {/*        value={selectedFailureMode}*/}
                {/*        onChange={handleChange}*/}
                {/*        renderValue={(selected: FailureMode) => selected["http://onto.fel.cvut.cz/ontologies/fta-fmea-application/hasName"]}*/}
                {/*    >*/}
                {/*        {*/}
                {/*            failureModes.map((failureMode) =>*/}
                {/*                //@ts-ignore*/}
                {/*                <MenuItem key={failureMode["@id"]} value={failureMode} >*/}
                {/*                    <ListItemText primary={failureMode["http://onto.fel.cvut.cz/ontologies/fta-fmea-application/hasName"] } />*/}
                {/*                </MenuItem>*/}
                {/*            )}*/}
                {/*    </Select>*/}
                {/*</Box>*/}


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