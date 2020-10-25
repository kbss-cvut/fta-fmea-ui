import * as React from "react";

import {Box, Button, TextField} from "@material-ui/core";
import useStyles from "./FailureModePickerDialog.styles";
import {useFailureModes} from "@hooks/useFailureModes";
import {CreateFailureMode} from "@models/failureModeModel";
import {CreateTreeNode, TreeNodeType} from "@models/treeNodeModel";
import {EventType, FaultEvent} from "@models/eventModel";
import VocabularyUtils from "@utils/VocabularyUtils";
import {useState} from "react";
import {RiskPriorityNumber} from "@models/rpnModel";

const FailureModeCreateDialog = ({selectedFunction, functionSelected}) => {
    const classes = useStyles()
    const [_, addFailureMode] = useFailureModes()

    const [name, setName] = useState<string>()
    const [description, setDescription] = useState<string>()
    const [probability, setProbability] = useState<number>()
    const [severity, setSeverity] = useState<number>()
    const [detection, setDetection] = useState<number>()

    const handleCreateFailureMode = () => {
        const failureMode = {
            rpn: {
                probability: probability,
                severity: severity,
                detection: detection,
                "@type": [VocabularyUtils.RPN]
            } as RiskPriorityNumber,
            manifestingNode: {
                nodeType: TreeNodeType.EVENT,
                event: {
                    eventType: EventType.BASIC,
                    name: name,
                    description: description,
                    "@type": [VocabularyUtils.FAULT_EVENT],
                    probability: probability,
                } as FaultEvent,
                "@type": [VocabularyUtils.TREE_NODE],
            } as CreateTreeNode
        } as CreateFailureMode
        addFailureMode(selectedFunction.iri, failureMode)
    }

    return (
        <div className={classes.divForm}>
            <TextField disabled={!functionSelected} autoFocus margin="dense" label="Name" type="text" fullWidth
                       onChange={(e) => setName(e.target.value)}/>
            <TextField disabled={!functionSelected} margin="dense" label="Description" type="text" fullWidth
                       onChange={(e) => setDescription(e.target.value)}/>
            <Box className={classes.rpnBox}>
                <TextField disabled={!functionSelected} label="Probability" type="number"
                           onChange={(e) => setProbability(parseFloat(e.target.value))}/>
                <TextField disabled={!functionSelected} label="Severity" type="number"
                           onChange={(e) => setSeverity(parseFloat(e.target.value))}/>
                <TextField disabled={!functionSelected} label="Detection" type="number"
                           onChange={(e) => setDetection(parseFloat(e.target.value))}/>
            </Box>
            <Button color="primary" fullWidth onClick={handleCreateFailureMode}>
                Create Failure Mode
            </Button>
        </div>
    );
}

export default FailureModeCreateDialog;