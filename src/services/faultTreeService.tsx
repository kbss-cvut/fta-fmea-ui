import JsonLdUtils from "@utils/JsonLdUtils";
import {authHeaders} from "@services/utils/authUtils";
import axiosClient from "@services/utils/axiosUtils";
import {FaultTree, CONTEXT} from "@models/faultTreeModel";
import VocabularyUtils from "@utils/VocabularyUtils";
import {extractFragment} from "@services/utils/uriIdentifierUtils";
import {
    CONTEXT as FAILURE_MODES_TABLE_CONTEXT,
    CreateFailureModesTable,
    FailureModesTable
} from "@models/failureModesTableModel";

export const findAll = async (): Promise<FaultTree[]> => {
    try {
        const response = await axiosClient.get<FaultTree[]>(
            '/faultTrees',
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferencesAsArray<FaultTree>(response.data, CONTEXT)
    } catch (e) {
        console.log('Fault Tree Service - Failed to call /findAll')
        return new Promise((resolve, reject) => reject("Failed to load fault trees"));
    }
}

export const find = async (faultTreeUri: string): Promise<FaultTree> => {
    try {
        const fragment = extractFragment(faultTreeUri);
        const response = await axiosClient.get<FaultTree[]>(
            `/faultTrees/${fragment}`,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<FaultTree>(response.data, CONTEXT)
    } catch (e) {
        console.log('Fault Tree Service - Failed to call /find')
        return new Promise((resolve, reject) => reject("Failed to find fault tree"));
    }
}

export const create = async (faultTree: FaultTree): Promise<FaultTree> => {
    try {
        const createRequest = Object.assign(
            {"@type": [VocabularyUtils.FAULT_TREE]}, faultTree, {"@context": CONTEXT}
        )

        const response = await axiosClient.post(
            '/faultTrees',
            createRequest,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<FaultTree>(response.data, CONTEXT);
    } catch (e) {
        console.log('Fault Tree Service - Failed to call /create')
        return new Promise((resolve, reject) => reject("Failed to create fault tree"));
    }
}

export const update = async (faultTree: FaultTree): Promise<FaultTree> => {
    try {
        const updateRequest = Object.assign({}, faultTree, {"@context": CONTEXT})

        const response = await axiosClient.put(
            '/faultTrees',
            updateRequest,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<FaultTree>(response.data, CONTEXT);
    } catch (e) {
        console.log('Fault Tree Service - Failed to call /update')
        return new Promise((resolve, reject) => reject("Failed to update fault tree"));
    }
}

export const remove = async (faultTreeIri: string): Promise<void> => {
    try {
        const fragment = extractFragment(faultTreeIri);

        await axiosClient.delete(
            `/faultTrees/${fragment}`,
            {
                headers: authHeaders()
            }
        )
        return new Promise((resolve) => resolve());
    } catch (e) {
        console.log('Fault Tree Service - Failed to call /remove')
        return new Promise((resolve, reject) => reject("Failed to remove fault tree"));
    }
}

export const createFailureModesTable = async (faultTreeIri: string, failureModesTable: CreateFailureModesTable): Promise<FailureModesTable> => {
    try {
        const createRequest = Object.assign(
            {"@type": [VocabularyUtils.FAILURE_MODES_TABLE]}, failureModesTable, {"@context": FAILURE_MODES_TABLE_CONTEXT}
        )

        const fragment = extractFragment(faultTreeIri);
        const response = await axiosClient.post(
            `/faultTrees/${fragment}/failureModesTable`,
            createRequest,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<FailureModesTable>(response.data, FAILURE_MODES_TABLE_CONTEXT);
    } catch (e) {
        console.log('Fault Tree Service - Failed to call /createFailureModesTable')
        return new Promise((resolve, reject) => reject("Failed to create failure modes table"));
    }
}
