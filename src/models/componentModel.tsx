import VocabularyUtils from "@utils/VocabularyUtils";
import {AuthoredModel, CONTEXT as AUTHORED_CONTEXT} from "@models/authoredModel";
import {Function, CONTEXT as FUNCTION_CONTEXT} from "@models/functionModel";
import {FailureMode} from "@models/failureModeModel";

const ctx = {
    "name": VocabularyUtils.PREFIX + "hasName",
    "functions": VocabularyUtils.PREFIX + "hasFunction",
    "failureModes": VocabularyUtils.PREFIX + "hasFailureMode",
    "parentComponent": VocabularyUtils.PREFIX + "isPartOf",
};

export const CONTEXT = Object.assign({}, ctx, AUTHORED_CONTEXT, FUNCTION_CONTEXT);

export interface CreateComponent {
    name: string,
    parentComponent?: Component,
}

export interface Component extends CreateComponent, AuthoredModel {
    functions?: Function[],
    failureModes?: FailureMode[],
}