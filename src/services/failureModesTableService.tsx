import JsonLdUtils from "@utils/JsonLdUtils";
import {authHeaders} from "@services/utils/authUtils";
import axiosClient from "@services/utils/axiosUtils";
import {FailureModesTable, CONTEXT, UpdateFailureModesTable} from "../models/failureModesTableModel";
import {FaultTree} from "@models/faultTreeModel";
import {extractFragment} from "@services/utils/uriIdentifierUtils";

export const findAll = async (): Promise<FailureModesTable[]> => {
    try {
        const response = await axiosClient.get<FailureModesTable[]>(
            '/failureModesTable',
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferencesAsArray<FailureModesTable>(response.data, CONTEXT)
    } catch (e) {
        console.log('Failure Modes Table Service - Failed to call /findAll')
        return new Promise((resolve, reject) => reject("Failed to load failure modes tables"));
    }
}

export const update = async (table: UpdateFailureModesTable): Promise<FailureModesTable> => {
    try {
        const response = await axiosClient.put(
            '/failureModesTable',
            table,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<FailureModesTable>(response.data, CONTEXT);
    } catch (e) {
        console.log('Failure Modes Table Service - Failed to call /update')
        return new Promise((resolve, reject) => reject("Failed to failure modes tables"));
    }
}

export const remove = async (tableIri: string): Promise<void> => {
    try {
        const fragment = extractFragment(tableIri);

        await axiosClient.delete(
            `/failureModesTable/${fragment}`,
            {
                headers: authHeaders()
            }
        )
        return new Promise((resolve) => resolve());
    } catch (e) {
        console.log('Failure Modes Table Service - Failed to call /remove')
        return new Promise((resolve, reject) => reject("Failed to remove failure modes tables"));
    }
}