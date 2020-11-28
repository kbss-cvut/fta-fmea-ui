import axiosClient from "@services/utils/axiosUtils";
import {authHeaders} from "@services/utils/authUtils";

import JsonLdUtils from "@utils/JsonLdUtils";
import {CONTEXT as EVENT_CONTEXT, EventType, FaultEvent, GateType} from "@models/eventModel";
import VocabularyUtils from "@utils/VocabularyUtils";
import {extractFragment} from "@services/utils/uriIdentifierUtils";
import {findIndex, flatten, sortBy} from "lodash";
import {CONTEXT as FAILURE_MODE_CONTEXT, CreateFailureMode, FailureMode} from "@models/failureModeModel";

export const findAll = async (): Promise<FaultEvent[]> => {
    try {
        const response = await axiosClient.get(
            `/faultEvents`,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferencesAsArray<FaultEvent>(response.data, EVENT_CONTEXT);
    } catch (e) {
        console.log('Event Service - Failed to call /findAll')
        return new Promise((resolve, reject) => reject("Failed to find fault events"));
    }
}

export const update = async (faultEvent: FaultEvent): Promise<void> => {
    try {
        const updateRequest = Object.assign({}, faultEvent, {"@context": EVENT_CONTEXT})

        await axiosClient.put(
            '/faultEvents',
            updateRequest,
            {
                headers: authHeaders()
            }
        )
        return new Promise((resolve) => resolve());
    } catch (e) {
        console.log('Event Service - Failed to call /update')
        return new Promise((resolve, reject) => reject("Failed to update fault event"));
    }
}

export const remove = async (faultEventIri: string): Promise<void> => {
    try {
        const fragment = extractFragment(faultEventIri);

        await axiosClient.delete(
            `/faultEvents/${fragment}`,
            {
                headers: authHeaders()
            }
        )
        return new Promise((resolve) => resolve());
    } catch (e) {
        console.log('Event Service - Failed to call /remove')
        return new Promise((resolve, reject) => reject("Failed to remove fault event"));
    }
}

export const addEvent = async (faultEventIri: string, event: FaultEvent): Promise<FaultEvent> => {
    try {
        const fragment = extractFragment(faultEventIri);
        let createRequest;
        if (event.iri) {
            console.log('addEvent - using existing event')
            createRequest = Object.assign({}, event, {"@context": EVENT_CONTEXT})
        } else {
            createRequest = Object.assign({"@type": [VocabularyUtils.FAULT_EVENT]}, event, {"@context": EVENT_CONTEXT})
        }

        const response = await axiosClient.post(
            `/faultEvents/${fragment}/inputEvents`,
            createRequest,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<FaultEvent>(response.data, EVENT_CONTEXT);
    } catch (e) {
        console.log('Event Service - Failed to call /addEvent')
        return new Promise((resolve, reject) => reject("Failed to create event"));
    }
}

export const eventFromHookFormValues = (values: any): FaultEvent => {
    let faultEvent
    if (values.existingEvent) {
        console.log(`Using existing event -${values.existingEvent.iri}`);
        faultEvent = values.existingEvent;
    } else {
        faultEvent = {
            eventType: values.eventType,
            name: values.name,
            description: values.description,
            probability: values.probability,
            "@type": [VocabularyUtils.FAULT_EVENT],
        } as FaultEvent

        faultEvent.gateType = (faultEvent.eventType === EventType.INTERMEDIATE) ? values.gateType : GateType.UNUSED;
    }

    return faultEvent;
}

export const getFailureMode = async (eventUri: string): Promise<FailureMode> => {
    try {
        const fragment = extractFragment(eventUri);

        const response = await axiosClient.get(
            `/faultEvents/${fragment}/failureMode`,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<FailureMode>(response.data, FAILURE_MODE_CONTEXT);
    } catch (e) {
        console.log('Event Service - Failed to call /getFailureMode')
        return new Promise((resolve, reject) => reject("Failed to load event failure mode"));
    }
}

export const addFailureMode = async (eventUri: string, failureMode: CreateFailureMode): Promise<FailureMode> => {
    try {
        const fragment = extractFragment(eventUri);
        const createRequest = Object.assign(
            {"@type": [VocabularyUtils.FAILURE_MODE]}, failureMode, {"@context": FAILURE_MODE_CONTEXT}
        )

        const response = await axiosClient.post(
            `/faultEvents/${fragment}/failureMode`,
            createRequest,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<FailureMode>(response.data, FAILURE_MODE_CONTEXT);
    } catch (e) {
        console.log('Event Service - Failed to call /addFailureMode')
        return new Promise((resolve, reject) => reject("Failed to create failure mode"));
    }
}

export const deleteFailureMode = async (eventUri: string): Promise<void> => {
    try {
        const fragment = extractFragment(eventUri);

        await axiosClient.delete(
            `/faultEvents/${fragment}/failureMode`,
            {
                headers: authHeaders()
            }
        )

        return new Promise((resolve) => resolve());
    } catch (e) {
        console.log('Event Service - Failed to call /deleteFailureMode')
        return new Promise((resolve, reject) => reject("Failed to delete event failure mode"));
    }
}


export const updateChildrenSequence = async (faultEventIri: string, childrenSequence: FaultEvent[]): Promise<void> => {
    try {
        const updateRequest = flatten([childrenSequence]).map(child => child.iri);

        const fragment = extractFragment(faultEventIri);
        await axiosClient.put(
            `/faultEvents/${fragment}/childrenSequence`,
            updateRequest,
            {
                headers: authHeaders()
            }
        )
        return new Promise((resolve) => resolve());
    } catch (e) {
        console.log('Event Service - Failed to call /updateChildrenSequence')
        return new Promise((resolve, reject) => reject("Failed to update children sequence"));
    }
}

export const sequenceListToArray = (sequenceList: any): string[] => {
    return (sequenceList) ? flatten([sequenceList["@list"]]).map(value => value.iri) : [];
}

export const eventChildrenSorted = (eventChildren: FaultEvent[], sequence: string[]): FaultEvent[] => {
    const flattenedChildren = flatten([eventChildren]);
    const flattenedSequence = flatten(sequence);

    return sortBy(flattenedChildren, child => findIndex(flattenedSequence, el => el === child.iri));
}