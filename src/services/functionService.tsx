import axiosClient from "@services/utils/axiosUtils";
import {authHeaders} from "@services/utils/authUtils";
import {extractFragment} from "@services/utils/uriIdentifierUtils";
import {UriReference} from "@models/utils/uriReference";

export const addFailureMode = async (functionIri: string, failureModeIri: string): Promise<void> => {
    try {
        const fragment = extractFragment(functionIri);
        const createRequest = {uri: failureModeIri} as UriReference

        await axiosClient.post(
            `/functions/${fragment}/failureModes`,
            createRequest,
            {
                headers: authHeaders()
            }
        )
    } catch (e) {
        console.log('Function Service - Failed to call /addFailureMode')
        return new Promise((resolve, reject) => reject("Failed to add failure mode"));
    }
}