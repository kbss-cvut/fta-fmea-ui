import VocabularyUtils from "@utils/VocabularyUtils";
import {AbstractModel, CONTEXT as ABSTRACT_CONTEXT} from "@models/abstractModel";
import {Event, CONTEXT as EVENT_CONTEXT} from "@models/eventModel";

const ctx = {
    "parent": VocabularyUtils.PREFIX + "hasParent",
    "children": VocabularyUtils.PREFIX + "hasChildren",
    "nodeType": VocabularyUtils.PREFIX + "hasTreeNodeType",
    "event": VocabularyUtils.PREFIX + "holds",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT, EVENT_CONTEXT);

export enum TreeNodeType {
    EVENT = "EVENT",
    GATE = "GATE",
}

export interface TreeNode extends AbstractModel {
    parent: TreeNode,
    children: TreeNode[],
    nodeType: TreeNodeType,
    event: Event
}