import * as React from "react";
import {useEffect, useState} from "react";
import {merge, cloneDeep} from "lodash";
import {Button, Typography} from "@material-ui/core";
import FaultEventCreation from "../../../../dialog/faultEvent/FaultEventCreation";
import {useForm} from "react-hook-form";
import {schema as eventSchema} from "../../../../dialog/faultEvent/FaultEventCreation.schema";
import {yupResolver} from "@hookform/resolvers/yup";
import * as faultEventService from "@services/faultEventService";
import {deepOmit} from "@utils/lodashUtils";
import {FaultEvent} from "@models/eventModel";
import FaultEventChildrenReorderList
    from "@components/editor/faultTree/menu/faultEvent/reorder/FaultEventChildrenReorderList";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import {sequenceListToArray} from "@services/faultEventService";

interface Props {
    data?: FaultEvent,
    onEventUpdated: (faultEvent: FaultEvent) => void,
    refreshTree: () => void,
}

const FaultEventShapeToolPane = ({data, onEventUpdated, refreshTree}: Props) => {
    const [showSnackbar] = useSnackbar();

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
            gateType: data.gateType
        }

        useFormMethods = useForm({
            resolver: yupResolver(eventSchema),
        });

        updateFunction = async (values: any) => {
            let dataClone = cloneDeep(data)

            const updatedFaultEvent = deepOmit(faultEventService.eventFromHookFormValues(values), '@type')
            dataClone = merge(dataClone, updatedFaultEvent)

            onEventUpdated(dataClone)
        }

        editorPane = <FaultEventCreation useFormMethods={useFormMethods} eventReusing={false}/>
    } else {
        defaultValues = {}
        useFormMethods = useForm();
        editorPane = <Typography variant="subtitle1" align='left'>No Event selected</Typography>
    }

    const eventSelected = Boolean(data)
    const {handleSubmit, reset, formState} = useFormMethods;
    const {isSubmitting, isDirty} = formState;

    useEffect(() => {
        reset(defaultValues)
        if(data) {
            const sequence = sequenceListToArray(data.childrenSequence)
            const sorted = faultEventService.eventChildrenSorted(data.children, sequence)
            setEventChildren(sorted)
        }
    }, [data])

    const [eventChildren, setEventChildren] = useState<FaultEvent[] | null>(null)
    const handleChildrenReordered = (updatedSequence: FaultEvent[]) => {
        faultEventService.updateChildrenSequence(data?.iri, updatedSequence)
            .then(value => refreshTree())
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR));
    }

    return (
        <React.Fragment>
            {editorPane}
            {eventChildren && <FaultEventChildrenReorderList eventChildren={eventChildren} handleReorder={handleChildrenReordered}/>}
            {isDirty &&
            <Button disabled={isSubmitting || !eventSelected} color="primary"
                    onClick={handleSubmit(updateFunction)}>
                Save
            </Button>
            }
        </React.Fragment>
    );
}

export default FaultEventShapeToolPane;