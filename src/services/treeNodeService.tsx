import axiosClient from "@services/utils/axiosUtils";
import {authHeaders} from "@services/utils/authUtils";
import {extractFragment} from "@services/utils/uriIdentifierUtils";

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