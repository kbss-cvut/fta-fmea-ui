import JsonLdUtils from "../utils/JsonLdUtils";
import {authHeaders} from "@services/utils/authUtils";
import axiosClient from "@services/utils/axiosUtils";
import VocabularyUtils from "@utils/VocabularyUtils";
import {FailureMode, CONTEXT} from "@models/failureModeModel";

export const findAll = async (): Promise<FailureMode[]> => {
    try {
        const response = await axiosClient.get<FailureMode[]>(
            '/failureModes',
            {
                headers: authHeaders()
            }
        )

        console.log(response);
        return JsonLdUtils.compactAndResolveReferencesAsArray<FailureMode>(response.data, CONTEXT)
    } catch (e) {
        console.log('Failure Mode Service - Failed to call /findAll')
        return [];
    }
}

export const create = async (failureMode: FailureMode): Promise<FailureMode> => {
    // TODO
    // try {
    //     const createRequest = Object.assign(
    //         {"@type": [VocabularyUtils.COMPONENT]}, component, {"@context": CONTEXT}
    //     )
    //
    //     const response = await axiosClient.post(
    //         '/components',
    //         createRequest,
    //         {
    //             headers: authHeaders()
    //         }
    //     )
    //
    //     return JsonLdUtils.compactAndResolveReferences<Component>(response.data, CONTEXT);
    // } catch (e) {
    //     console.log('Failure Mode Service - Failed to call /create')
    //     return undefined; // TODO throw error?
    // }
    return undefined
}