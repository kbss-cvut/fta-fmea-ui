import * as React from "react";

import {
    Box, Button,
    Dialog, TextField,
} from "@material-ui/core";
import useStyles from "@components/dialog/faultEvent/FaultEventCreation.styles";
import {DialogTitle} from "@components/dialog/custom/DialogTitle";
import {DialogContent} from "@components/dialog/custom/DialogContent";
import {useFailureModes} from "@hooks/useFailureModes";
import {useForm} from "react-hook-form";
import {schema} from "@components/dialog/faultEvent/FaultEventCreation.schema";
import {CreateTreeNode, TreeNodeType} from "@models/treeNodeModel";
import {EventType, FaultEvent} from "@models/eventModel";
import VocabularyUtils from "@utils/VocabularyUtils";
import {CreateFailureMode} from "@models/failureModeModel";
import {useState} from "react";
import {DialogActions} from "@components/dialog/custom/DialogActions";
import FaultEventCreation from "@components/dialog/faultEvent/FaultEventCreation";

const FailureModeDialog = ({open, handleCloseDialog}) => {
    const [_, addFailureMode] = useFailureModes()
    const [processing, setIsProcessing] = useState(false)

    const useFormMethods = useForm({resolver: schema});
    const {handleSubmit} = useFormMethods;

    const handleCreateFailureMode = async (values: any) => {
        setIsProcessing(true)

        const failureMode = {
            manifestingNode: {
                nodeType: TreeNodeType.EVENT,
                event: {
                    eventType: EventType.TOP_EVENT,
                    name: values.name,
                    description: values.description,
                    rpn: {
                        probability: values.probability,
                        severity: values.severity,
                        detection: values.detection,
                        "@type": [VocabularyUtils.RPN]
                    },
                    "@type": [VocabularyUtils.FAULT_EVENT],
                } as FaultEvent,
                "@type": [VocabularyUtils.TREE_NODE],
            } as CreateTreeNode
        } as CreateFailureMode

        await addFailureMode(failureMode)

        setIsProcessing(false)
        handleCloseDialog()
    }

    return (
        <div>
            <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="form-dialog-title" maxWidth="md"
                    fullWidth>
                <DialogTitle id="form-dialog-title" onClose={handleCloseDialog}>Create Failure Mode</DialogTitle>
                <DialogContent dividers>
                    <FaultEventCreation useFormMethods={useFormMethods} topEventOnly={true}/>
                </DialogContent>
                <DialogActions>
                    <Button disabled={processing} color="primary" onClick={handleSubmit(handleCreateFailureMode)}>
                        Create Failure Mode
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default FailureModeDialog;