import * as React from "react";

import {Box, Button, TextField} from "@material-ui/core";
import useStyles from "./FailureModePickerDialog.styles";
import {useFailureModes} from "@hooks/useFailureModes";
import {CreateFailureMode} from "@models/failureModeModel";
import {CreateTreeNode, TreeNodeType} from "@models/treeNodeModel";
import {EventType, FaultEvent} from "@models/eventModel";
import VocabularyUtils from "@utils/VocabularyUtils";
import {RiskPriorityNumber} from "@models/rpnModel";
import {useForm} from 'react-hook-form';
import {schema} from "@components/dialog/failureMode/content/FailureModeCreateDialog.schema";

const FailureModeCreateDialog = ({selectedFunction, functionSelected}) => {
    const classes = useStyles()
    const [_, addFailureMode] = useFailureModes()

    const {register, handleSubmit, errors} = useForm({
        resolver: schema
    });

    const handleCreateFailureMode = (values: any) => {
        console.log(`handleCreateFailureMode- ${JSON.stringify(values)}`)
        const failureMode = {
            rpn: {
                probability: values.probability,
                severity: values.severity,
                detection: values.detection,
                "@type": [VocabularyUtils.RPN]
            } as RiskPriorityNumber,
            manifestingNode: {
                nodeType: TreeNodeType.EVENT,
                event: {
                    eventType: EventType.BASIC,
                    name: values.name,
                    description: values.description,
                    "@type": [VocabularyUtils.FAULT_EVENT],
                    probability: values.probability,
                } as FaultEvent,
                "@type": [VocabularyUtils.TREE_NODE],
            } as CreateTreeNode
        } as CreateFailureMode
        addFailureMode(selectedFunction.iri, failureMode)
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
            <Button color="primary" fullWidth onClick={handleSubmit(handleCreateFailureMode)}>
                Create Failure Mode
            </Button>
        </div>
    );
}

export default FailureModeCreateDialog;