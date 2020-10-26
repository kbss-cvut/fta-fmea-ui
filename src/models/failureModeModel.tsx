import VocabularyUtils from "@utils/VocabularyUtils";
import {RiskPriorityNumber, CONTEXT as RPN_CONTEXT} from "@models/rpnModel";
import {TreeNode, CONTEXT as TREE_NODE_CONTEXT, CreateTreeNode} from "@models/treeNodeModel";
import {Mitigation, CONTEXT as MITIGATION_CONTEXT} from "@models/mitigationModel";
import {AuthoredModel, CONTEXT as AUTHORED_CONTEXT} from "@models/authoredModel";
import {FaultEvent} from "@models/eventModel";
import {AbstractModel} from "@models/abstractModel";

const ctx = {
    "manifestingNode": VocabularyUtils.PREFIX + "isManifestedBy",
    "mitigation": VocabularyUtils.PREFIX + "isMitigatedBy",
};

export const CONTEXT = Object.assign({}, ctx, AUTHORED_CONTEXT, TREE_NODE_CONTEXT, MITIGATION_CONTEXT);

export interface CreateFailureMode extends AbstractModel {
    manifestingNode: CreateTreeNode,
    mitigation?: Mitigation[]
}

export interface FailureMode extends AuthoredModel {
    manifestingNode: TreeNode<FaultEvent>,
    mitigation?: Mitigation[]
}