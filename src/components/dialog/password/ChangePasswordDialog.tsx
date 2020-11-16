import * as React from "react";

import {Button, Dialog, TextField,} from "@material-ui/core";
import {DialogTitle} from "../../materialui/dialog/DialogTitle";
import {DialogContent} from "../../materialui/dialog/DialogContent";
import {useForm} from "react-hook-form";
import {useState} from "react";
import {DialogActions} from "../../materialui/dialog/DialogActions";
import {yupResolver} from "@hookform/resolvers/yup";
import * as userService from "../../../services/userService";
import {SnackbarType, useSnackbar} from "../../../hooks/useSnackbar";
import {schema} from "./ChangePasswordDialog.schema";

const ChangePasswordDialog = ({open, handleCloseDialog, user}) => {
    const [processing, setIsProcessing] = useState(false)
    const [showSnackbar] = useSnackbar();

    const {register, handleSubmit, errors} = useForm({resolver: yupResolver(schema),});

    const handleChangePassword = async (values: any) => {
        setIsProcessing(true)

        userService.changePassword({
            uri: user.iri,
            username: user.username,
            password: values.password,
            newPassword: values.newPassword
        }).then(value => {
            showSnackbar("User password updated", SnackbarType.SUCCESS);
            handleCloseDialog()
        }).catch(reason => {
            setIsProcessing(false)
            showSnackbar(reason, SnackbarType.ERROR)
        })
    }


    return (
        <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="form-dialog-title" maxWidth="md"
                fullWidth>
            <DialogTitle id="form-dialog-title" onClose={handleCloseDialog}>Change Password?</DialogTitle>
            <DialogContent dividers>
                <TextField inputRef={register} margin="normal" required fullWidth
                           name="password" label="Current Password" type="password"
                           error={!!errors.password}/>

                <TextField inputRef={register} margin="normal" required fullWidth
                           name="newPassword" label="New Password" type="password"
                           error={!!errors.newPassword}/>
            </DialogContent>
            <DialogActions>
                <Button disabled={processing} color="primary" onClick={handleSubmit(handleChangePassword)}>
                    Change Password
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ChangePasswordDialog;