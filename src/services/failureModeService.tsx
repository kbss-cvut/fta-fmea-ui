import JsonLdUtils from "@utils/JsonLdUtils";
import {authHeaders} from "@services/utils/authUtils";
import axiosClient from "@services/utils/axiosUtils";
import {FailureMode, CONTEXT, CreateFailureMode, CONTEXT as FAILURE_MODE_CONTEXT} from "@models/failureModeModel";
import VocabularyUtils from "@utils/VocabularyUtils";
import {FaultEvent} from "@models/eventModel";
import {extractFragment} from "@services/utils/uriIdentifierUtils";

export const findAll = async (): Promise<FailureMode[]> => {
    try {
        const response = await axiosClient.get<FailureMode[]>(
            '/failureModes',
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferencesAsArray<FailureMode>(response.data, CONTEXT)
    } catch (e) {
        console.log('Failure Mode Service - Failed to call /findAll')
        return new Promise((resolve, reject) => reject("Failed to load failure modes"));
    }
}

export const create = async (failureMode: CreateFailureMode): Promise<FailureMode> => {
    try {
        const createRequest = Object.assign(
            {"@type": [VocabularyUtils.FAILURE_MODE]}, failureMode, {"@context": FAILURE_MODE_CONTEXT}
        )

        const response = await axiosClient.post(
            '/failureModes',
            createRequest,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<FailureMode>(response.data, FAILURE_MODE_CONTEXT);
    } catch (e) {
        console.log('Failure Mode Service - Failed to call /create')
        return new Promise((resolve, reject) => reject("Failed to create failure mode"));
    }
}

export const find = async (iri: string): Promise<FailureMode> => {
    try {
        const fragment = extractFragment(iri);
        const response = await axiosClient.get<FailureMode>(
            `/failureModes/${fragment}`,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<FailureMode>(response.data, CONTEXT)
    } catch (e) {
        console.log('Failure Mode Service - Failed to call /find')
        return new Promise((resolve, reject) => reject("Failed to load failure mode"));
    }
}

export const update = async (failureMode: FailureMode): Promise<void> => {
    try {
        const updateRequest = Object.assign({}, failureMode, {"@context": FAILURE_MODE_CONTEXT})

        await axiosClient.put(
            '/failureModes',
            updateRequest,
            {
                headers: authHeaders()
            }
        )
        return new Promise((resolve) => resolve());
    } catch (e) {
        console.log('Failure Mode Service - Failed to call /update')
        return new Promise((resolve, reject) => reject("Failed to update failure mode"));
    }
}

export const extractEvent = (failureMode: FailureMode): FaultEvent => {
    return failureMode.manifestingNode.event as FaultEvent
}