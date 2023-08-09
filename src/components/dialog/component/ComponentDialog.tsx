import * as React from "react";

import {Button, Dialog, TextField,} from "@mui/material";
import {DialogTitle} from "@components/materialui/dialog/DialogTitle";
import {DialogContent} from "@components/materialui/dialog/DialogContent";
import {DialogActions} from "@components/materialui/dialog/DialogActions";
import * as componentService from "@services/componentService";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {Component} from "@models/componentModel";
import {schema} from "./Component.schema";

interface Props {
    open: boolean,
    onCreated: (newComponent: Component) => void,
    onClose: () => void,
}

const ComponentDialog = ({open, onCreated, onClose}: Props) => {
    const [showSnackbar] = useSnackbar()

    const useFormMethods = useForm({resolver: yupResolver(schema)});
    const {handleSubmit, formState, register, formState: { errors }} = useFormMethods;
    const {isSubmitting} = formState

    const handleCreateComponent = async (values: any) => {
        const newComponent = {
            name: values.name,
        };

        componentService.create(newComponent)
            .then(value => {
                onClose()
                onCreated(value)
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    return (
        <div>
            <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth>
                <DialogTitle id="form-dialog-title" onClose={onClose}>Create Component</DialogTitle>
                <DialogContent dividers>
                    <TextField autoFocus margin="dense" label="Component Name" name="name" type="text"
                               fullWidth {...register("name")}
                               error={!!errors.name} helperText={errors.name?.message}/>
                </DialogContent>
                <DialogActions>
                    <Button disabled={isSubmitting} color="primary" onClick={handleSubmit(handleCreateComponent)}>
                        Create Component
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ComponentDialog;