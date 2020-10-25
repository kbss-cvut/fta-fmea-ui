import {CONTEXT as FAILURE_MODE_CONTEXT, CreateFailureMode, FailureMode} from "@models/failureModeModel";
import VocabularyUtils from "@utils/VocabularyUtils";
import axiosClient from "@services/utils/axiosUtils";
import {authHeaders} from "@services/utils/authUtils";
import JsonLdUtils from "@utils/JsonLdUtils";
import {extractFragment} from "@services/utils/uriIdentifierUtils";

export const addFailureMode = async (functionIri: string, failureMode: CreateFailureMode): Promise<FailureMode> => {
    try {
        const fragment = extractFragment(functionIri);
        const createRequest = Object.assign(
            {"@type": [VocabularyUtils.FAILURE_MODE]}, failureMode, {"@context": FAILURE_MODE_CONTEXT}
        )

        const response = await axiosClient.post(
            `/functions/${fragment}/failureModes`,
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