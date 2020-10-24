import VocabularyUtils from "@utils/VocabularyUtils";
import {RiskPriorityNumber, CONTEXT as RPN_CONTEXT} from "@models/rpnModel";
import {TreeNode, CONTEXT as TREE_NODE_CONTEXT} from "@models/treeNodeModel";
import {Mitigation, CONTEXT as MITIGATION_CONTEXT} from "@models/mitigationModel";
import {AuthoredModel, CONTEXT as AUTHORED_CONTEXT} from "@models/authoredModel";

const ctx = {
    "rpn": VocabularyUtils.PREFIX + "hasRPN",
    "manifestingNode": VocabularyUtils.PREFIX + "isManifestedBy",
    "mitigation": VocabularyUtils.PREFIX + "isMitigatedBy",
};

export const CONTEXT = Object.assign({}, ctx, AUTHORED_CONTEXT, RPN_CONTEXT, TREE_NODE_CONTEXT, MITIGATION_CONTEXT);

export interface FailureMode extends AuthoredModel {
    rpn: RiskPriorityNumber,
    manifestingNode: TreeNode,
    mitigation: Mitigation[]
}