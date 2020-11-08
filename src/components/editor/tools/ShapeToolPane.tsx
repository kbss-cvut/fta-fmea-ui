import * as React from "react";
import {useEffect, useState} from "react";
import useStyles from "./ShapeToolPane.styles";
import {Button, Divider, Paper, Typography} from "@material-ui/core";
import {TreeNode, TreeNodeType} from "@models/treeNodeModel";
import {Event, EventType, FaultEvent, Gate} from "@models/eventModel";
import FaultEventCreation from "@components/dialog/faultEvent/FaultEventCreation";
import {useForm} from "react-hook-form";
import GateCreation from "@components/dialog/gate/GateCreation";
import {schema as eventSchema} from "@components/dialog/faultEvent/FaultEventCreation.schema";

interface Props {
    data?: TreeNode<Event>
}

const ShapeToolPane = ({data}: Props) => {
    const classes = useStyles()

    let editorPane;
    let updateFunction;
    let useFormMethods;
    let defaultValues;
    switch (data?.nodeType) {
        case TreeNodeType.EVENT:
            const eventToUpdate = (data.event) as FaultEvent

            defaultValues = {
                eventType: eventToUpdate.eventType,
                name: eventToUpdate.name,
                description: eventToUpdate.description,
                probability: eventToUpdate.rpn.probability,
                severity: eventToUpdate.rpn.severity,
                detection: eventToUpdate.rpn.detection,
            }

            useFormMethods = useForm({
                resolver: eventSchema,
            });

            updateFunction = async (values: any) => {
                console.log(`Updating event... ${JSON.stringify(values)}`)
            }

            editorPane = <FaultEventCreation useFormMethods={useFormMethods}
                                             topEventOnly={eventToUpdate.eventType === EventType.TOP_EVENT}/>
            break;
        case TreeNodeType.GATE:
            const gateToUpdate = (data.event) as Gate

            defaultValues = {
                gateType: gateToUpdate.gateType
            }
            useFormMethods = useForm({});

            updateFunction = async (values: any) => {
                console.log(`Updating gate... ${JSON.stringify(values)}`)
            }

            editorPane = <GateCreation useFormMethods={useFormMethods}/>
            break;
        default:
            defaultValues = {}
            useFormMethods = useForm({});
            editorPane = <Typography variant="body1">No Event selected</Typography>
            break;
    }

    const eventSelected = Boolean(data)
    const {handleSubmit, reset, formState} = useFormMethods;
    const {isSubmitting, isDirty} = formState;

    useEffect(() => {
        reset(defaultValues)
    }, [data])

    return (
        <Paper className={classes.paper} elevation={3}>
            <Typography className={classes.title} variant="h5" gutterBottom>Edit Event</Typography>
            <Divider/>
            {editorPane}
            {isDirty &&
            <Button disabled={isSubmitting || !eventSelected} color="primary"
                    onClick={handleSubmit(updateFunction)}>
                Save
            </Button>
            }
        </Paper>
    );
}

export default ShapeToolPane;