import {Component, CONTEXT, CreateComponent} from "@models/componentModel";
import JsonLdUtils from "../utils/JsonLdUtils";
import {authHeaders} from "@services/utils/authUtils";
import axiosClient from "@services/utils/axiosUtils";
import VocabularyUtils from "@utils/VocabularyUtils";

export const findAll = async (): Promise<Component[]> => {
    try {
        const response = await axiosClient.get<Component[]>(
            '/components',
            {
                headers: authHeaders()
            }
        )

        console.log(response);
        return JsonLdUtils.compactAndResolveReferencesAsArray<Component>(response.data, CONTEXT)
    } catch (e) {
        console.log('Component Service - Failed to call /findAll')
        return [];
    }
}

export const create = async (component: CreateComponent): Promise<Component> => {
    try {
        const createRequest = Object.assign(
            {"@type": [VocabularyUtils.COMPONENT]}, component, {"@context": CONTEXT}
        )

        const response = await axiosClient.post(
            '/components',
            createRequest,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<Component>(response.data, CONTEXT);
    } catch (e) {
        console.log('Component Service - Failed to call /create')
        return undefined; // TODO throw error?
    }
}