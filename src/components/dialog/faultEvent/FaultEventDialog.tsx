import * as React from "react";

import {Button, Dialog,} from "@material-ui/core";
import {DialogTitle} from "@components/materialui/dialog/DialogTitle";
import {DialogContent} from "@components/materialui/dialog/DialogContent";
import {FaultEvent} from "@models/eventModel";
import {DialogActions} from "@components/materialui/dialog/DialogActions";
import * as treeNodeService from "@services/treeNodeService";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import FaultEventCreation from "./FaultEventCreation";
import {useForm} from "react-hook-form";
import {schema} from "./FaultEventCreation.schema";
import VocabularyUtils from "@utils/VocabularyUtils";
import {yupResolver} from "@hookform/resolvers/yup";
import {TreeNode} from "@models/treeNodeModel";

interface Props {
    open: boolean,
    nodeIri: string,
    onCreated: (newNode: TreeNode) => void,
    onClose: () => void,
}

const FaultEventDialog = ({open, nodeIri, onCreated, onClose}: Props) => {
    const [showSnackbar] = useSnackbar()

    const useFormMethods = useForm({resolver: yupResolver(schema)});
    const {handleSubmit, formState} = useFormMethods;
    const {isSubmitting} = formState

    const handleCreateEvent = async (values: any) => {
        console.log(`Creating event with eventType - ${values.eventType}`)
        let requestEvent;
        if (values.existingEvent) {
            requestEvent = values.existingEvent;
            console.log(`Using existing event -${requestEvent.iri}`);
        } else {
            requestEvent = {
                eventType: values.eventType,
                name: values.name,
                description: values.description,
                rpn: {
                    probability: values.probability,
                    severity: values.severity,
                    detection: values.detection,
                    "@type": [VocabularyUtils.RPN]
                },
                gateType: values.gateType,
                "@type": [VocabularyUtils.FAULT_EVENT],
            } as FaultEvent
        }

        treeNodeService.addEvent(nodeIri, requestEvent)
            .then(value => {
                onClose()
                onCreated(value)
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    return (
        <div>
            <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth>
                <DialogTitle id="form-dialog-title" onClose={onClose}>Create Event</DialogTitle>
                <DialogContent dividers>
                    <FaultEventCreation useFormMethods={useFormMethods} allowTypePicker={true} eventReusing={true}/>
                </DialogContent>
                <DialogActions>
                    <Button disabled={isSubmitting} color="primary" onClick={handleSubmit(handleCreateEvent)}>
                        Create Event
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default FaultEventDialog;