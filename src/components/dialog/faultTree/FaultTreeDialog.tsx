import * as React from "react";

import {Button, Dialog, TextField,} from "@material-ui/core";
import {DialogTitle} from "@components/materialui/dialog/DialogTitle";
import {DialogContent} from "@components/materialui/dialog/DialogContent";
import {useForm} from "react-hook-form";
import {schema} from "@components/dialog/faultTree/FaultTreeDialog.schema";
import {CreateTreeNode} from "@models/treeNodeModel";
import VocabularyUtils from "@utils/VocabularyUtils";
import {eventFromHookFormValues} from "@services/faultEventService";
import {useState} from "react";
import {DialogActions} from "@components/materialui/dialog/DialogActions";
import FaultEventCreation from "@components/dialog/faultEvent/FaultEventCreation";
import {useFaultTrees} from "@hooks/useFaultTrees";
import {FaultTree} from "@models/faultTreeModel";
import {yupResolver} from "@hookform/resolvers/yup";

const FaultTreeDialog = ({open, handleCloseDialog}) => {
    const [, addFaultTree] = useFaultTrees()
    const [processing, setIsProcessing] = useState(false)

    const useFormMethods = useForm({resolver: yupResolver(schema)});
    const {handleSubmit} = useFormMethods;

    const handleCreateFaultTree = async (values: any) => {
        setIsProcessing(true)

        const rootEvent = eventFromHookFormValues(values);

        const faultTree = {
            name: values.faultTreeName,
            manifestingNode: {
                event: rootEvent,
                "@type": [VocabularyUtils.TREE_NODE],
            } as CreateTreeNode
        } as FaultTree

        await addFaultTree(faultTree)

        setIsProcessing(false)
        handleCloseDialog()
    }

    return (
        <div>
            <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="form-dialog-title" maxWidth="md"
                    fullWidth>
                <DialogTitle id="form-dialog-title" onClose={handleCloseDialog}>Create Fault Tree</DialogTitle>
                <DialogContent dividers>
                    <TextField autoFocus margin="dense" label="Fault Tree Name" name="faultTreeName" type="text"
                               fullWidth inputRef={useFormMethods.register}
                               error={!!useFormMethods.errors.faultTreeName}
                               helperText={useFormMethods.errors.faultTreeName?.message}/>
                    <FaultEventCreation useFormMethods={useFormMethods} eventReusing={true}/>
                </DialogContent>
                <DialogActions>
                    <Button disabled={processing} color="primary" onClick={handleSubmit(handleCreateFaultTree)}>
                        Create Fault Tree
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default FaultTreeDialog;