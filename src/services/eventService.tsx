import axiosClient from "@services/utils/axiosUtils";
import {authHeaders} from "@services/utils/authUtils";
import {extractFragment} from "@services/utils/uriIdentifierUtils";

import VocabularyUtils from "@utils/VocabularyUtils";
import JsonLdUtils from "@utils/JsonLdUtils";
import {Gate, CONTEXT as EVENT_CONTEXT, CreateGate} from "@models/eventModel";
import {TreeNode} from "@models/treeNodeModel";

export const insertGate = async (treeNodeIri: string, gate: CreateGate): Promise<TreeNode<Gate>> => {
    try {
        const fragment = extractFragment(treeNodeIri);
        const createRequest = Object.assign(
            {"@type": [VocabularyUtils.GATE]}, gate, {"@context": EVENT_CONTEXT}
        )

        const response = await axiosClient.post(
            `/events/${fragment}/gate`,
            createRequest,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<TreeNode<Gate>>(response.data, EVENT_CONTEXT);
    } catch (e) {
        console.log('Event Service - Failed to call /insertGate')
        return undefined; // TODO throw error?
    }
}