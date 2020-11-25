import JsonLdUtils from "@utils/JsonLdUtils";
import {authHeaders} from "@services/utils/authUtils";
import axiosClient from "@services/utils/axiosUtils";
import {System, CONTEXT} from "@models/systemModel";
import VocabularyUtils from "@utils/VocabularyUtils";
import {extractFragment} from "@services/utils/uriIdentifierUtils";
import {deepOmit} from "@utils/lodashUtils";

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

export const rename = async (system: System): Promise<System> => {
    try {
        const systemRename = deepOmit(system, ['components'])
        const updateRequest = Object.assign({}, systemRename, {"@context": CONTEXT})

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

export const addComponent = async (systemIri: string, componentUri: string): Promise<void> => {
    try {
        const systemFragment = extractFragment(systemIri);
        const componentFragment = extractFragment(componentUri);

        await axiosClient.post(
            `/systems/${systemFragment}/components/${componentFragment}`,
            null,
            {
                headers: authHeaders()
            }
        )

        return new Promise((resolve) => resolve());
    } catch (e) {
        console.log('System Service - Failed to call /addComponent')
        return new Promise((resolve, reject) => reject("Failed to add component"));
    }
}

export const removeComponent = async (systemIri: string, componentUri: string): Promise<void> => {
    try {
        const systemFragment = extractFragment(systemIri);
        const componentFragment = extractFragment(componentUri);

        await axiosClient.delete(
            `/systems/${systemFragment}/components/${componentFragment}`,
            {
                headers: authHeaders()
            }
        )

        return new Promise((resolve) => resolve());
    } catch (e) {
        console.log('System Service - Failed to call /removeComponent')
        return new Promise((resolve, reject) => reject("Failed to remove component"));
    }
}