import * as React from "react";

import {Button, Dialog, TextField,} from "@material-ui/core";
import {DialogTitle} from "@components/materialui/dialog/DialogTitle";
import {DialogContent} from "@components/materialui/dialog/DialogContent";
import {useForm} from "react-hook-form";
import {schema} from "@components/dialog/faultTree/FaultTreeDialog.schema";
import {useEffect, useState} from "react";
import {DialogActions} from "@components/materialui/dialog/DialogActions";
import {useFaultTrees} from "@hooks/useFaultTrees";
import {FaultTree} from "@models/faultTreeModel";
import {yupResolver} from "@hookform/resolvers/yup";

interface Props {
    open: boolean,
    handleCloseDialog: () => void,
    faultTree: FaultTree
}

const FaultTreeEditDialog = ({open, handleCloseDialog, faultTree}: Props) => {
    const [, , updateTree] = useFaultTrees()
    const [processing, setIsProcessing] = useState(false)

    const useFormMethods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {faultTreeName: faultTree?.name}
    });
    const {handleSubmit, reset} = useFormMethods;

    useEffect(() => {
        reset({
            faultTreeName: faultTree?.name
        })
    }, [faultTree])

    const handleCreateFaultTree = async (values: any) => {
        setIsProcessing(true)

        faultTree.name = values.faultTreeName;
        await updateTree(faultTree)

        setIsProcessing(false)
        handleCloseDialog()
    }

    return (
        <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="tree-edit-dialog-title" maxWidth="md"
                fullWidth>
            <DialogTitle id="tree-edit-dialog-title" onClose={handleCloseDialog}>Edit Fault Tree</DialogTitle>
            <DialogContent dividers>
                <TextField autoFocus margin="dense" label="Fault Tree Name" name="faultTreeName" type="text"
                           fullWidth inputRef={useFormMethods.register}
                           error={!!useFormMethods.errors.faultTreeName}/>
            </DialogContent>
            <DialogActions>
                <Button disabled={processing} color="primary" onClick={handleSubmit(handleCreateFaultTree)}>
                    Save Fault Tree
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FaultTreeEditDialog;