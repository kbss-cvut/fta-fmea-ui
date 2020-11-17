import * as React from "react";
import {useEffect} from "react";
import {merge, cloneDeep} from "lodash";
import {Button, Typography} from "@material-ui/core";
import {TreeNode} from "@models/treeNodeModel";
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
            probability: eventToUpdate.probability,
            severity: eventToUpdate.rpn.severity,
            occurrence: eventToUpdate.rpn.occurrence,
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
        editorPane = <Typography variant="subtitle1" align='center'>No Event selected</Typography>
    }

    const eventSelected = Boolean(data)
    const {handleSubmit, reset, formState} = useFormMethods;
    const {isSubmitting, isDirty} = formState;

    useEffect(() => {
        reset(defaultValues)
    }, [data])

    return (
        <React.Fragment>
            {editorPane}
            {isDirty &&
            <Button disabled={isSubmitting || !eventSelected} color="primary"
                    onClick={handleSubmit(updateFunction)}>
                Save
            </Button>
            }
        </React.Fragment>
    );
}

export default ShapeToolPane;