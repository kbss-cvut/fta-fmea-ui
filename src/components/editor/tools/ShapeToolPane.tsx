import * as React from "react";
import {useEffect} from "react";
import useStyles from "./ShapeToolPane.styles";
import {merge, cloneDeep} from "lodash";
import {Button, Divider, Paper, Typography} from "@material-ui/core";
import {TreeNode} from "@models/treeNodeModel";
import {FaultEvent} from "@models/eventModel";
import FaultEventCreation from "@components/dialog/faultEvent/FaultEventCreation";
import {useForm} from "react-hook-form";
import {schema as eventSchema} from "@components/dialog/faultEvent/FaultEventCreation.schema";
import {yupResolver} from "@hookform/resolvers/yup";
import {eventFromHookFormValues} from "@services/faultEventService";
import {deepOmit} from "@utils/lodashUtils";

interface Props {
    data?: TreeNode,
    onNodeUpdated: (node: TreeNode) => void,
}

const ShapeToolPane = ({data, onNodeUpdated}: Props) => {
    const classes = useStyles()

    let editorPane;
    let updateFunction;
    let useFormMethods;
    let defaultValues;

    if (data) {
        const eventToUpdate = data.event

        defaultValues = {
            eventType: eventToUpdate.eventType,
            name: eventToUpdate.name,
            description: eventToUpdate.description,
            probability: eventToUpdate.rpn.probability,
            severity: eventToUpdate.rpn.severity,
            detection: eventToUpdate.rpn.detection,
            gateType: eventToUpdate.gateType
        }

        useFormMethods = useForm({
            resolver: yupResolver(eventSchema),
        });

        updateFunction = async (values: any) => {
            const dataClone = cloneDeep(data)

            const updatedFaultEvent = deepOmit(eventFromHookFormValues(values), '@type')
            dataClone.event = merge(dataClone.event, updatedFaultEvent)

            onNodeUpdated(dataClone)
        }

        editorPane = <FaultEventCreation useFormMethods={useFormMethods} eventReusing={false}/>
    } else {
        defaultValues = {}
        useFormMethods = useForm();
        editorPane = <Typography variant="body1">No Event selected</Typography>
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