import JsonLdUtils from "../utils/JsonLdUtils";
import {authHeaders} from "@services/utils/authUtils";
import axiosClient from "@services/utils/axiosUtils";
import {FailureMode, CONTEXT, CreateFailureMode, CONTEXT as FAILURE_MODE_CONTEXT} from "@models/failureModeModel";
import {extractFragment} from "@services/utils/uriIdentifierUtils";
import VocabularyUtils from "@utils/VocabularyUtils";
import {FaultEvent} from "@models/eventModel";

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
        return [];
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
        return undefined; // TODO throw error?
    }
}

export const extractEvent = (failureMode: FailureMode): FaultEvent => {
    return failureMode.manifestingNode.event as FaultEvent
}