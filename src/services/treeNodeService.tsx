import axiosClient from "@services/utils/axiosUtils";
import {authHeaders} from "@services/utils/authUtils";
import {extractFragment} from "@services/utils/uriIdentifierUtils";
import {CONTEXT as TREE_NODE_CONTEXT, TreeNode} from "@models/treeNodeModel";
import {CONTEXT as EVENT_CONTEXT, FaultEvent} from "@models/eventModel";
import VocabularyUtils from "@utils/VocabularyUtils";
import JsonLdUtils from "@utils/JsonLdUtils";

export const updateNode = async (node: TreeNode): Promise<void> => {
    try {
        const updateRequest = Object.assign({}, node, {"@context": TREE_NODE_CONTEXT})

        await axiosClient.put(
            '/treeNodes',
            updateRequest,
            {
                headers: authHeaders()
            }
        )
        return new Promise((resolve) => resolve());
    } catch (e) {
        console.log('Tree Node Service - Failed to call /update')
        return new Promise((resolve, reject) => reject("Failed to update tree node"));
    }
}

export const remove = async (treeNodeIri: string): Promise<void> => {
    try {
        const fragment = extractFragment(treeNodeIri);

        const response = await axiosClient.delete(
            `/treeNodes/${fragment}`,
            {
                headers: authHeaders()
            }
        )
        return new Promise((resolve) => resolve());
    } catch (e) {
        console.log('Tree Node Service - Failed to call /remove')
        return new Promise((resolve, reject) => reject("Failed to remove tree node"));
    }
}

export const addEvent = async (treeNodeIri: string, event: FaultEvent): Promise<TreeNode> => {
    try {
        const fragment = extractFragment(treeNodeIri);
        let createRequest;
        if (event.iri) {
            console.log('addEvent - using existing event')
            createRequest = Object.assign({}, event, {"@context": EVENT_CONTEXT})
        } else {
            createRequest = Object.assign({"@type": [VocabularyUtils.FAULT_EVENT]}, event, {"@context": EVENT_CONTEXT})
        }

        const response = await axiosClient.post(
            `/treeNodes/${fragment}/inputEvents`,
            createRequest,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<TreeNode>(response.data, TREE_NODE_CONTEXT);
    } catch (e) {
        console.log('Tree Node Service - Failed to call /addEvent')
        return new Promise((resolve, reject) => reject("Failed to create event"));
    }
}