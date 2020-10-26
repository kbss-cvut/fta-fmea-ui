import * as React from "react";

import {Box, Button, TextField} from "@material-ui/core";
import {useFailureModes} from "@hooks/useFailureModes";
import {CreateFailureMode} from "@models/failureModeModel";
import {CreateTreeNode, TreeNodeType} from "@models/treeNodeModel";
import {EventType, FaultEvent} from "@models/eventModel";
import VocabularyUtils from "@utils/VocabularyUtils";
import {useForm} from 'react-hook-form';
import {schema} from "@components/dialog/failureMode/content/FailureModeCreateDialog.schema";
import useStyles from "@components/dialog/failureMode/content/FailureModeDialogComponent.styles";

const FailureModeCreateDialog = ({selectedFunction, functionSelected, handleClose}) => {
    const classes = useStyles()
    const [_, addFailureMode] = useFailureModes()

    const {register, handleSubmit, errors} = useForm({
        resolver: schema
    });

    const handleCreateFailureMode = (values: any) => {
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

        addFailureMode(selectedFunction.iri, failureMode)
        handleClose()
    }

    return (
        <div className={classes.divForm}>
            <TextField disabled={!functionSelected} autoFocus margin="dense" label="Name" name="name" type="text"
                       fullWidth inputRef={register} error={!!errors.name} helperText={errors.name?.message}/>
            <TextField disabled={!functionSelected} margin="dense" label="Description" type="text" name="description"
                       fullWidth inputRef={register} error={!!errors.description} helperText={errors.description?.message}/>
            <Box className={classes.rpnBox}>
                <TextField disabled={!functionSelected} label="Probability" type="number" name="probability"
                           InputProps={{inputProps: {min: 0, max: 1, step: 0.01}}}
                           inputRef={register} error={!!errors.probability} helperText={errors.probability?.message}/>
                <TextField disabled={!functionSelected} label="Severity" type="number" name="severity"
                           InputProps={{inputProps: {min: 0, max: 10, step: 1}}}
                           inputRef={register} error={!!errors.severity} helperText={errors.probability?.severity}/>
                <TextField disabled={!functionSelected} label="Detection" type="number" name="detection"
                           InputProps={{inputProps: {min: 0, max: 10, step: 1}}}
                           inputRef={register} error={!!errors.detection} helperText={errors.probability?.detection}/>
            </Box>
            <div className={classes.createButtonDiv}>
                <Button color="primary" onClick={handleSubmit(handleCreateFailureMode)}>
                    Create Failure Mode
                </Button>
            </div>
        </div>
    );
}

export default FailureModeCreateDialog;