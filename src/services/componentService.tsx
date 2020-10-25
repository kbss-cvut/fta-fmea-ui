import {Component, CONTEXT, CreateComponent} from "@models/componentModel";
import {Function, CONTEXT as FUNCTION_CONTEXT, CreateFunction} from "@models/functionModel";
import JsonLdUtils from "../utils/JsonLdUtils";
import {authHeaders} from "@services/utils/authUtils";
import axiosClient from "@services/utils/axiosUtils";
import VocabularyUtils from "@utils/VocabularyUtils";
import {extractFragment} from "@services/utils/uriIdentifierUtils";

export const findAll = async (): Promise<Component[]> => {
    try {
        const response = await axiosClient.get<Component[]>(
            '/components',
            {
                headers: authHeaders()
            }
        )

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

export const functions = async (componentUri: string): Promise<Function[]> => {
    try {
        const fragment = extractFragment(componentUri);
        const response = await axiosClient.get<Function[]>(
            `/components/${fragment}/functions`,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferencesAsArray<Function>(response.data, FUNCTION_CONTEXT)
    } catch (e) {
        console.log('Component Service - Failed to call /functions')
        return [];
    }
}

export const addFunction = async (componentUri: string, f: CreateFunction): Promise<Function> => {
    try {
        const fragment = extractFragment(componentUri);
        const createRequest = Object.assign(
            {"@type": [VocabularyUtils.FUNCTION]}, f, {"@context": FUNCTION_CONTEXT}
        )

        const response = await axiosClient.post(
            `/components/${fragment}/functions`,
            createRequest,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<Function>(response.data, CONTEXT);
    } catch (e) {
        console.log('Component Service - Failed to call create function')
        return undefined; // TODO throw error?
    }
}