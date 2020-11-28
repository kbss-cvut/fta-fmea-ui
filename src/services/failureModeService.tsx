import JsonLdUtils from "@utils/JsonLdUtils";
import {authHeaders} from "@services/utils/authUtils";
import axiosClient from "@services/utils/axiosUtils";
import {FailureMode, CONTEXT} from "@models/failureModeModel";
import {extractFragment} from "@services/utils/uriIdentifierUtils";
import {handleServerError} from "./utils/responseUtils";

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
        const defaultMessage = "Failed to load failure modes";
        return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
    }
}

export const find = async (failureModeIri: string): Promise<FailureMode> => {
    try {
        const fragment = extractFragment(failureModeIri);

        const response = await axiosClient.get<FailureMode>(
            `/failureModes/${fragment}`,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<FailureMode>(response.data, CONTEXT)
    } catch (e) {
        console.log('Failure Mode Service - Failed to call /find')
        const defaultMessage = "Failed to load failure mode";
        return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
    }
}

export const update = async (failureMode: FailureMode): Promise<FailureMode> => {
    try {
        const updateRequest = Object.assign({}, failureMode, {"@context": CONTEXT})

        const response = await axiosClient.put(
            '/failureModes',
            updateRequest,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<FailureMode>(response.data, CONTEXT);
    } catch (e) {
        console.log('Failure Mode Service - Failed to call /update')
        const defaultMessage = "Failed to update failure mode";
        return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
    }
}

export const remove = async (failureModeIri: string): Promise<void> => {
    try {
        const fragment = extractFragment(failureModeIri);

        await axiosClient.delete(
            `/failureModes/${fragment}`,
            {
                headers: authHeaders()
            }
        )
        return new Promise((resolve) => resolve());
    } catch (e) {
        console.log('Failure Mode Service - Failed to call /remove')
        const defaultMessage = "Failed to remove failure mode";
        return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
    }
}