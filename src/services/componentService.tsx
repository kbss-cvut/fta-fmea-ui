import {Component, CONTEXT} from "@models/componentModel";
import JsonLdUtils from "../utils/JsonLdUtils";
import {authHeaders} from "@utils/userSessionUtils";
import axiosClient from "@services/utils/axiosUtils";

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