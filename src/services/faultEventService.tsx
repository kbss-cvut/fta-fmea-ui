import axiosClient from "@services/utils/axiosUtils";
import {authHeaders} from "@services/utils/authUtils";

import JsonLdUtils from "@utils/JsonLdUtils";
import {CONTEXT as EVENT_CONTEXT, EventType, FaultEvent, GateType} from "@models/eventModel";
import VocabularyUtils from "@utils/VocabularyUtils";
import {extractFragment} from "@services/utils/uriIdentifierUtils";
import {flatten} from "lodash";

export const findFaultEvents = async (): Promise<FaultEvent[]> => {
    try {
        const response = await axiosClient.get(
            `/faultEvents`,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferencesAsArray<FaultEvent>(response.data, EVENT_CONTEXT);
    } catch (e) {
        console.log('Event Service - Failed to call /findFaultEvents')
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

export const eventPathToRoot = async (faultEventIri: string) : Promise<FaultEvent[]> => {
    try {
        const fragment = extractFragment(faultEventIri);

        const response = await axiosClient.get(
            `/faultEvents/${fragment}/eventPathToRoot`,
            {
                headers: authHeaders()
            }
        )
        return JsonLdUtils.compactAndResolveReferencesAsArray<FaultEvent>(response.data, EVENT_CONTEXT);
    } catch (e) {
        console.log('Event Service - Failed to call /eventPathToRoot')
        return new Promise((resolve, reject) => reject("Failed to resolve event paths"));
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
            rpn: {
                severity: values.severity,
                occurrence: values.occurrence,
                detection: values.detection,
                "@type": [VocabularyUtils.RPN]
            },
            "@type": [VocabularyUtils.FAULT_EVENT],
        } as FaultEvent

        faultEvent.gateType = (faultEvent.eventType === EventType.INTERMEDIATE) ? values.gateType : GateType.UNUSED;
    }

    return faultEvent;
}

export const toEventsWithChildReferences = (events: FaultEvent[]) => {
    return events.map(e => {
        e.children = flatten([e.children]).map(child => {return {iri: child.iri}})
        return e
    })
}