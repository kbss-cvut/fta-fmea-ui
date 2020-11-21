import JsonLdUtils from "@utils/JsonLdUtils";
import {authHeaders} from "@services/utils/authUtils";
import axiosClient from "@services/utils/axiosUtils";
import {FailureMode, CONTEXT} from "@models/failureModeModel";

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