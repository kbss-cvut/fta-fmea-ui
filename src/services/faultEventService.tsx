import axiosClient from "@services/utils/axiosUtils";
import {authHeaders} from "@services/utils/authUtils";

import JsonLdUtils from "@utils/JsonLdUtils";
import {CONTEXT as EVENT_CONTEXT, EventType, FaultEvent} from "@models/eventModel";
import VocabularyUtils from "@utils/VocabularyUtils";

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
            rpn: {
                probability: values.probability,
                severity: values.severity,
                detection: values.detection,
                "@type": [VocabularyUtils.RPN]
            },
            "@type": [VocabularyUtils.FAULT_EVENT],
        } as FaultEvent

        if (faultEvent.eventType === EventType.INTERMEDIATE) {
            faultEvent.gateType = values.gateType
        } else {
            faultEvent.gateType = undefined; // TODO remove key
        }
    }

    return faultEvent;
}