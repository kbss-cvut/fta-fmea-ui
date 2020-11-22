import JsonLdUtils from "@utils/JsonLdUtils";
import {authHeaders} from "@services/utils/authUtils";
import axiosClient from "@services/utils/axiosUtils";
import {System, CONTEXT} from "@models/systemModel";
import VocabularyUtils from "@utils/VocabularyUtils";
import {extractFragment} from "@services/utils/uriIdentifierUtils";

export const findAll = async (): Promise<System[]> => {
    try {
        const response = await axiosClient.get<System[]>(
            '/systems',
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferencesAsArray<System>(response.data, CONTEXT)
    } catch (e) {
        console.log('System Service - Failed to call /findAll')
        return new Promise((resolve, reject) => reject("Failed to load systems"));
    }
}

export const find = async (systemIri: string): Promise<System> => {
    try {
        const fragment = extractFragment(systemIri);
        const response = await axiosClient.get<System[]>(
            `/systems/${fragment}`,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<System>(response.data, CONTEXT)
    } catch (e) {
        console.log('System Service - Failed to call /find')
        return new Promise((resolve, reject) => reject("Failed to find system"));
    }
}

export const create = async (system: System): Promise<System> => {
    try {
        const createRequest = Object.assign(
            {"@type": [VocabularyUtils.SYSTEM]}, system, {"@context": CONTEXT}
        )

        const response = await axiosClient.post(
            '/systems',
            createRequest,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<System>(response.data, CONTEXT);
    } catch (e) {
        console.log('System Service - Failed to call /create')
        return new Promise((resolve, reject) => reject("Failed to create system"));
    }
}

export const update = async (system: System): Promise<System> => {
    try {
        const updateRequest = Object.assign({}, system, {"@context": CONTEXT})

        const response = await axiosClient.put(
            '/systems',
            updateRequest,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<System>(response.data, CONTEXT);
    } catch (e) {
        console.log('System Service - Failed to call /update')
        return new Promise((resolve, reject) => reject("Failed to update system"));
    }
}

export const remove = async (systemIri: string): Promise<void> => {
    try {
        const fragment = extractFragment(systemIri);

        await axiosClient.delete(
            `/systems/${fragment}`,
            {
                headers: authHeaders()
            }
        )
        return new Promise((resolve) => resolve());
    } catch (e) {
        console.log('System Service - Failed to call /remove')
        return new Promise((resolve, reject) => reject("Failed to remove system"));
    }
}