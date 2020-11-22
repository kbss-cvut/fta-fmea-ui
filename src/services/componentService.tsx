import {Component, CONTEXT, CreateComponent} from "@models/componentModel";
import {Function, CONTEXT as FUNCTION_CONTEXT, CreateFunction} from "@models/functionModel";
import JsonLdUtils from "@utils/JsonLdUtils";
import {authHeaders} from "@services/utils/authUtils";
import axiosClient from "@services/utils/axiosUtils";
import VocabularyUtils from "@utils/VocabularyUtils";
import {extractFragment} from "@services/utils/uriIdentifierUtils";
import {FailureMode, CONTEXT as FAILURE_MODE_CONTEXT} from "@models/failureModeModel";

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
        return new Promise((resolve, reject) => reject("Failed to load components"));
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
        return new Promise((resolve, reject) => reject("Failed to create component"));
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
        return new Promise((resolve, reject) => reject("Failed to load functions"));
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
        return new Promise((resolve, reject) => reject("Failed to create function"));
    }
}

export const removeFunction = async (componentIri: string, functionIri: string) => {
    try {
        const componentFragment = extractFragment(componentIri);
        const functionFragment = extractFragment(functionIri);

        await axiosClient.delete(
            `/components/${componentFragment}/functions/${functionFragment}`,
            {
                headers: authHeaders()
            }
        )
        return new Promise((resolve) => resolve());
    } catch (e) {
        console.log('Component Service - Failed to call /removeFunction')
        return new Promise((resolve, reject) => reject("Failed to remove function"));
    }
}

export const addFailureMode = async (componentUri: string, failureMode: FailureMode): Promise<FailureMode> => {
    try {
        const fragment = extractFragment(componentUri);
        const createRequest = Object.assign(
            {"@type": [VocabularyUtils.FAILURE_MODE]}, failureMode, {"@context": FAILURE_MODE_CONTEXT}
        )

        const response = await axiosClient.post(
            `/components/${fragment}/failureModes`,
            createRequest,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<FailureMode>(response.data, FAILURE_MODE_CONTEXT);
    } catch (e) {
        console.log('Component Service - Failed to call add failure mode')
        return new Promise((resolve, reject) => reject("Failed to create failure mode"));
    }
}

export const linkComponent = async (componentUri: string, linkUri: string): Promise<Component> => {
    try {
        const fragment = extractFragment(componentUri);
        const linkFragment = extractFragment(linkUri);

        const response = await axiosClient.post(
            `/components/${fragment}/linkComponent/${linkFragment}`,
            null,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<Component>(response.data, CONTEXT);
    } catch (e) {
        console.log('Component Service - Failed to call /linkComponent')
        return new Promise((resolve, reject) => reject("Failed to link components"));
    }
}

export const unlinkComponent = async (componentUri: string): Promise<void> => {
    try {
        const fragment = extractFragment(componentUri);

        await axiosClient.delete(
            `/components/${fragment}/linkComponent`,
            {
                headers: authHeaders()
            }
        )

        return new Promise((resolve) => resolve());
    } catch (e) {
        console.log('Component Service - Failed to call /unlinkComponent')
        return new Promise((resolve, reject) => reject("Failed to unlink components"));
    }
}