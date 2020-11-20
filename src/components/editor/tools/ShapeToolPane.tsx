import * as React from "react";
import {useEffect} from "react";
import {merge, cloneDeep} from "lodash";
import {Button, Typography} from "@material-ui/core";
import FaultEventCreation from "@components/dialog/faultEvent/FaultEventCreation";
import {useForm} from "react-hook-form";
import {schema as eventSchema} from "@components/dialog/faultEvent/FaultEventCreation.schema";
import {yupResolver} from "@hookform/resolvers/yup";
import {eventFromHookFormValues} from "@services/faultEventService";
import {deepOmit} from "@utils/lodashUtils";
import {FaultEvent} from "@models/eventModel";

interface Props {
    data?: FaultEvent,
    onEventUpdated: (faultEvent: FaultEvent) => void,
}

const ShapeToolPane = ({data, onEventUpdated}: Props) => {
    let editorPane;
    let updateFunction;
    let useFormMethods;
    let defaultValues;

    if (data) {
        defaultValues = {
            eventType: data.eventType,
            name: data.name,
            description: data.description,
            probability: data.probability,
            severity: data.rpn.severity,
            occurrence: data.rpn.occurrence,
            detection: data.rpn.detection,
            gateType: data.gateType
        }

        useFormMethods = useForm({
            resolver: yupResolver(eventSchema),
        });

        updateFunction = async (values: any) => {
            let dataClone = cloneDeep(data)

            const updatedFaultEvent = deepOmit(eventFromHookFormValues(values), '@type')
            dataClone = merge(dataClone, updatedFaultEvent)

            onEventUpdated(dataClone)
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