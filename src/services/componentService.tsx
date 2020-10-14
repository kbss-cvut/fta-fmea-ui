import axios from 'axios';
import {Component, CONTEXT} from "@models/componentModel";
import JsonLdUtils from "../utils/JsonLdUtils";
import {getLoggedUser} from "@utils/userSessionUtils";

export const findAll = async (): Promise<Component[]> => {
    try {
        console.log('kuk');
        const response = await axios.get<Component[]>(
            `${process.env.BASE_API_URL}/components`,
            {
                headers: {
                    'Authorization': `Bearer ${getLoggedUser().token}`
                }
            }
        )

        console.log(response);
        return JsonLdUtils.compactAndResolveReferencesAsArray<Component>(response.data, CONTEXT)
    } catch (e) {
        console.log('Failed to call /register')
        return undefined;
    }
}

// TODO unauthorized handling