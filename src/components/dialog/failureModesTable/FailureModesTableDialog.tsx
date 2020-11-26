import * as React from "react";

import {Button, Dialog, TextField,} from "@material-ui/core";
import {DialogTitle} from "@components/materialui/dialog/DialogTitle";
import {DialogContent} from "@components/materialui/dialog/DialogContent";
import {useForm} from "react-hook-form";
import {DialogActions} from "@components/materialui/dialog/DialogActions";
import {yupResolver} from "@hookform/resolvers/yup";
import {schema} from "./FailureModesTableDialog.schema";
import {CreateFailureModesTable} from "@models/failureModesTableModel";
import * as faultTreeService from "@services/faultTreeService";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import FaultTreePaths from "@components/dialog/faultTree/paths/FaultTreePaths";
import {FaultTreePathsProvider} from "@hooks/useFaultTreePaths";
import {FaultEvent} from "@models/eventModel";

interface Props {
    open: boolean,
    faultTreeIri: string,
    onCreated: (tableIri: string) => void,
    onClose: () => void,
}

const FailureModesTableDialog = ({open, onClose, onCreated, faultTreeIri}: Props) => {
    const [showSnackbar] = useSnackbar();
    const useFormMethods = useForm({resolver: yupResolver(schema)});
    const {handleSubmit, register, errors, formState} = useFormMethods;
    const {isSubmitting} = formState;

    const selectedPathsMap = new Map<number, FaultEvent[]>();

    const handleConversion = (values: any) => {
        // TODO take paths and create rows!
        // TODO assign RPN

        const table = {
            name: values.fmeaName,
        } as CreateFailureModesTable

        faultTreeService.createFailureModesTable(faultTreeIri, table)
            .then(value => {
                onCreated(value.iri)
                onClose()
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    const updatePaths = (rowId: number, path: FaultEvent[]) => {
        selectedPathsMap.set(rowId, path);
    }

    return (
        <div>
            <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="md"
                    fullWidth>
                <DialogTitle id="form-dialog-title" onClose={onClose}>Convert To FMEA</DialogTitle>
                <DialogContent dividers>
                    <TextField autoFocus margin="dense" label="FMEA Name" name="fmeaName" type="text"
                               fullWidth inputRef={register}
                               error={!!errors.fmeaName}
                               helperText={errors.fmeaName?.message}/>
                    <FaultTreePathsProvider faultTreeIri={faultTreeIri}>
                        <FaultTreePaths updatePaths={updatePaths}/>
                    </FaultTreePathsProvider>
                </DialogContent>
                <DialogActions>
                    <Button disabled={isSubmitting} color="primary" onClick={handleSubmit(handleConversion)}>
                        Convert
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default FailureModesTableDialog;