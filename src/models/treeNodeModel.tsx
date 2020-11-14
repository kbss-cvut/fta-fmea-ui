import VocabularyUtils from "@utils/VocabularyUtils";
import {AbstractModel, CONTEXT as ABSTRACT_CONTEXT} from "@models/abstractModel";
import {FaultEvent, CONTEXT as EVENT_CONTEXT} from "@models/eventModel";

const ctx = {
    "parent": VocabularyUtils.PREFIX + "hasParent",
    "children": VocabularyUtils.PREFIX + "hasChildren",
    "event": VocabularyUtils.PREFIX + "holds",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT, EVENT_CONTEXT);

export interface CreateTreeNode extends AbstractModel {
    event: FaultEvent
}

export interface TreeNode extends CreateTreeNode {
    children: TreeNode[],
}