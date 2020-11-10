import VocabularyUtils from "@utils/VocabularyUtils";
import {TreeNode, CONTEXT as TREE_NODE_CONTEXT} from "@models/treeNodeModel";
import {AuthoredModel, CONTEXT as AUTHORED_CONTEXT} from "@models/authoredModel";
import {FaultEvent} from "@models/eventModel";

const ctx = {
    "manifestingNode": VocabularyUtils.PREFIX + "isManifestedBy",
    "name": VocabularyUtils.PREFIX + "hasName",
};

export const CONTEXT = Object.assign({}, ctx, AUTHORED_CONTEXT, TREE_NODE_CONTEXT);

export interface FaultTree extends AuthoredModel {
    name: string,
    manifestingNode: TreeNode<FaultEvent>,
}