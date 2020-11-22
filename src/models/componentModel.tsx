import VocabularyUtils from "@utils/VocabularyUtils";
import {AuthoredModel, CONTEXT as AUTHORED_CONTEXT} from "@models/authoredModel";
import {Function, CONTEXT as FUNCTION_CONTEXT} from "@models/functionModel";
import {FailureMode, CONTEXT as FAILURE_MODE_CONTEXT} from "@models/failureModeModel";

const ctx = {
    "name": VocabularyUtils.PREFIX + "hasName",
    "functions": VocabularyUtils.PREFIX + "hasFunction",
    "failureModes": VocabularyUtils.PREFIX + "hasFailureMode",
    "linkedComponent": VocabularyUtils.PREFIX + "isPartOf",
};

export const CONTEXT = Object.assign({}, ctx, AUTHORED_CONTEXT, FUNCTION_CONTEXT, FAILURE_MODE_CONTEXT);

export interface CreateComponent {
    name: string,
    linkedComponent?: Component,
}

export interface Component extends CreateComponent, AuthoredModel {
    functions?: Function[],
    failureModes?: FailureMode[],
}