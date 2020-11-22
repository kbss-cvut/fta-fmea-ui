import JsonLdUtils from "@utils/JsonLdUtils";
import {authHeaders} from "@services/utils/authUtils";
import axiosClient from "@services/utils/axiosUtils";
import {FailureMode, CONTEXT} from "@models/failureModeModel";
import {Component, CONTEXT as COMPONENT_CONTEXT} from "@models/componentModel";
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
        return new Promise((resolve, reject) => reject("Failed to load failure modee"));
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
        return new Promise((resolve, reject) => reject("Failed to update failure mode"));
    }
}

export const getComponent = async (failureModeIri: string): Promise<Component> => {
    try {
        const fragment = extractFragment(failureModeIri);

        const response = await axiosClient.get<Component>(
            `/failureModes/${fragment}/component`,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<Component>(response.data, COMPONENT_CONTEXT)
    } catch (e) {
        console.log('Failure Mode Service - Failed to call /getComponent')
        return new Promise((resolve, reject) => reject("Failed to load component by failure mode"));
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
        return new Promise((resolve, reject) => reject("Failed to remove failure mode"));
    }
}