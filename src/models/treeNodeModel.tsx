import VocabularyUtils from "@utils/VocabularyUtils";
import {AbstractModel, CONTEXT as ABSTRACT_CONTEXT} from "@models/abstractModel";
import {Event, Gate, CONTEXT as EVENT_CONTEXT} from "@models/eventModel";

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

export interface CreateTreeNode extends AbstractModel {
    nodeType: TreeNodeType,
    event: Event
}

export interface TreeNode<T extends Event> extends CreateTreeNode {
    children: TreeNode<T>[],
    nodeType: TreeNodeType,
}