import * as React from "react";

import {
    Box, Button,
    Dialog, TextField,
} from "@material-ui/core";
import useStyles from "@components/dialog/failureMode/FailureModeDialog.styles";
import {DialogTitle} from "@components/dialog/custom/DialogTitle";
import {DialogContent} from "@components/dialog/custom/DialogContent";
import {useFailureModes} from "@hooks/useFailureModes";
import {useForm} from "react-hook-form";
import {schema} from "@components/dialog/failureMode/FailureModeDialog.schema";
import {CreateTreeNode, TreeNodeType} from "@models/treeNodeModel";
import {EventType, FaultEvent} from "@models/eventModel";
import VocabularyUtils from "@utils/VocabularyUtils";
import {CreateFailureMode} from "@models/failureModeModel";
import {useState} from "react";
import {DialogActions} from "@components/dialog/custom/DialogActions";

const FailureModeDialog = ({open, handleCloseDialog}) => {
    const classes = useStyles()

    const [_, addFailureMode] = useFailureModes()
    const [processing, setIsProcessing] = useState(false)

    const {register, handleSubmit, errors} = useForm({
        resolver: schema
    });

    const handleCreateFailureMode = async (values: any) => {
        setIsProcessing(true)

        const failureMode = {
            manifestingNode: {
                nodeType: TreeNodeType.EVENT,
                event: {
                    eventType: EventType.BASIC,
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
                    <div className={classes.divForm}>
                        <TextField autoFocus margin="dense" label="Name" name="name" type="text"
                                   fullWidth inputRef={register} error={!!errors.name}
                                   helperText={errors.name?.message}/>
                        <TextField margin="dense" label="Description" type="text" name="description"
                                   fullWidth inputRef={register} error={!!errors.description}
                                   helperText={errors.description?.message}/>
                        <Box className={classes.rpnBox}>
                            <TextField label="Probability" type="number" name="probability"
                                       InputProps={{inputProps: {min: 0, max: 1, step: 0.01}}}
                                       inputRef={register} error={!!errors.probability}
                                       helperText={errors.probability?.message}/>
                            <TextField label="Severity" type="number" name="severity"
                                       InputProps={{inputProps: {min: 0, max: 10, step: 1}}}
                                       inputRef={register} error={!!errors.severity}
                                       helperText={errors.probability?.severity}/>
                            <TextField label="Detection" type="number" name="detection"
                                       InputProps={{inputProps: {min: 0, max: 10, step: 1}}}
                                       inputRef={register} error={!!errors.detection}
                                       helperText={errors.probability?.detection}/>
                        </Box>
                    </div>
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