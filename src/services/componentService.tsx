import axios from 'axios';
import {Component, CONTEXT} from "@models/componentModel";
import JsonLdUtils from "../utils/JsonLdUtils";
import {authHeaders} from "@utils/userSessionUtils";

export const findAll = async (): Promise<Component[]> => {
    try {
        const response = await axios.get<Component[]>(
            `${process.env.BASE_API_URL}/components`,
            {
                headers: authHeaders()
            }
        )

        console.log(response);
        return JsonLdUtils.compactAndResolveReferencesAsArray<Component>(response.data, CONTEXT)
    } catch (e) {
        console.log('Component Service - Failed to call /findAll')
        console.log(e.response.status)

        // TODO error handling
        // TODO unauthorized handling

        return [];
    }
}