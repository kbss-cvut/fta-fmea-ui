import * as React from "react";
import {useState} from "react";
import useStyles from "./ShapeToolPane.styles";
import {Button, Divider, Paper, Typography} from "@material-ui/core";
import {TreeNode, TreeNodeType} from "@models/treeNodeModel";
import {Event, EventType, FaultEvent, Gate} from "@models/eventModel";
import FaultEventCreation from "@components/dialog/faultEvent/FaultEventCreation";
import {useForm} from "react-hook-form";
import GateCreation from "@components/dialog/gate/GateCreation";
import {schema as eventSchema} from "@components/dialog/faultEvent/FaultEventCreation.schema";
import {RiskPriorityNumber} from "@models/rpnModel";
import {TakenAction} from "@models/takenActionModel";

interface ShapeToolWindowProps {
    data: TreeNode<Event>
}

const ShapeToolPane = ({data}: ShapeToolWindowProps) => {
    const classes = useStyles()
    const [processing, setProcessing] = useState(false)

    let editorPane;
    let useFormMethods;
    let updateFunction;
    switch (data.nodeType) {
        case TreeNodeType.EVENT:
            const eventToUpdate = (data.event) as FaultEvent
            useFormMethods = useForm({
                resolver: eventSchema,
                defaultValues: {
                    eventType: eventToUpdate.eventType,
                    name: eventToUpdate.name,
                    description: eventToUpdate.description,
                    // TODO RPN is not fetched from server!!!
                    // probability: eventToUpdate.rpn.probability,
                    // severity: eventToUpdate.rpn.severity,
                    // detection: eventToUpdate.rpn.detection,
                } as Record<string, any>
            });

            updateFunction = async (values: any) => {
                setProcessing(true)
                console.log(`Updating event... ${JSON.stringify(values)}`)
                setProcessing(false)
            }

            editorPane = <FaultEventCreation useFormMethods={useFormMethods}
                                             topEventOnly={eventToUpdate.eventType === EventType.TOP_EVENT}/>
            break;
        case TreeNodeType.GATE:
            const gateToUpdate = (data.event) as Gate
            useFormMethods = useForm({
                defaultValues: gateToUpdate
            });

            updateFunction = async (values: any) => {
                setProcessing(true)
                console.log(`Updating gate... ${JSON.stringify(values)}`)
                setProcessing(false)
            }

            editorPane = <GateCreation useFormMethods={useFormMethods}/>
            break;
    }

    const {handleSubmit} = useFormMethods;

    return (
        <Paper className={classes.paper} elevation={3}>
            <Typography className={classes.title} variant="h5" gutterBottom>Edit Event</Typography>
            <Divider/>
            {editorPane}
            <Button disabled={processing} color="primary" onClick={handleSubmit(updateFunction)}>Update & Save</Button>
        </Paper>
    );
}

export default ShapeToolPane;