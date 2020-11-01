import * as React from "react";

import {Button, Dialog, FormControl, InputLabel, MenuItem, Select,} from "@material-ui/core";
import useStyles from "@components/dialog/faultEvent/FaultEventCreation.styles";
import {DialogTitle} from "@components/dialog/custom/DialogTitle";
import {DialogContent} from "@components/dialog/custom/DialogContent";
import {CreateGate, EventType, FaultEvent, GateType} from "@models/eventModel";
import {useState} from "react";
import {DialogActions} from "@components/dialog/custom/DialogActions";
import * as eventService from "@services/eventService";
import {SnackbarType} from "@hooks/useSnackbar";
import FaultEventCreation from "./FaultEventCreation";
import {useForm} from "react-hook-form";
import {schema} from "./FaultEventCreation.schema";
import VocabularyUtils from "../../../utils/VocabularyUtils";

type FaultEventDialogProps = {
    treeNodeIri: string,
    onEventCreated: (TreeNode) => void,
    onClose: () => void,
    showSnackbar: (string, SnackbarType) => void
};

const FaultEventDialog = ({treeNodeIri, onEventCreated, onClose, showSnackbar}: FaultEventDialogProps) => {
    const [processing, setIsProcessing] = useState(false)

    const useFormMethods = useForm({resolver: schema});
    const {handleSubmit} = useFormMethods;

    const handleCreateEvent = async (values: any) => {
        setIsProcessing(true)

        console.log(`Creating event with eventType - ${values.eventType}`)
        const requestEvent = {
            eventType: values.eventType,
            name: values.name,
            description: values.description,
            rpn: {
                probability: values.probability,
                severity: values.severity,
                detection: values.detection,
                "@type": [VocabularyUtils.RPN]
            },
            "@type": [VocabularyUtils.FAULT_EVENT],
        } as FaultEvent

        eventService.addEvent(treeNodeIri, requestEvent)
            .then(value => onEventCreated(value))
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
            .finally(() => {
                setIsProcessing(false)
                onClose()
            })
    }

    return (
        <div>
            <Dialog open={true} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth>
                <DialogTitle id="form-dialog-title" onClose={onClose}>Create Event</DialogTitle>
                <DialogContent dividers>
                    <FaultEventCreation useFormMethods={useFormMethods} topEventOnly={false}/>
                </DialogContent>
                <DialogActions>
                    <Button disabled={processing} color="primary" onClick={handleSubmit(handleCreateEvent)}>
                        Create Event
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default FaultEventDialog;