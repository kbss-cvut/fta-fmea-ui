import axiosClient from "./utils/axiosUtils";
import {authHeaders} from "./utils/authUtils";
import {handleServerError} from "./utils/responseUtils";
import {Mitigation, CONTEXT as MITIGATION_CONTEXT} from "@models/mitigationModel";
import JsonLdUtils from "@utils/JsonLdUtils";

export const update = async (mitigation: Mitigation): Promise<Mitigation> => {
    try {
        const response = await axiosClient.put(
            '/mitigations',
            mitigation,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<Mitigation>(response.data, MITIGATION_CONTEXT);
    } catch (e) {
        console.log('Mitigation service - Failed to call /update')
        const defaultMessage = "Failed to update mitigation";
        return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
    }
}
