import VocabularyUtils from "@utils/VocabularyUtils";
import {AuthoredModel, CONTEXT as AUTHORED_CONTEXT} from "@models/authoredModel";
import {Function, CONTEXT as FUNCTION_CONTEXT} from "@models/functionModel";
import {FailureMode, CONTEXT as FAILURE_MODE_CONTEXT} from "@models/failureModeModel";
import {System} from "@models/systemModel";
import {AbstractUpdateModel} from "@models/abstractModel";

const ctx = {
    "name": VocabularyUtils.PREFIX + "hasName",
    "functions": VocabularyUtils.PREFIX + "hasFunction",
    "failureModes": VocabularyUtils.PREFIX + "hasFailureMode",
    "linkedComponent": VocabularyUtils.PREFIX + "isPartOf",
    "system": VocabularyUtils.PREFIX + "belongsTo",
};

export const CONTEXT = Object.assign({}, ctx, AUTHORED_CONTEXT, FUNCTION_CONTEXT, FAILURE_MODE_CONTEXT);

export interface CreateComponent {
    name: string,
    linkedComponent?: Component,
}

export interface UpdateComponent extends AbstractUpdateModel {
    name: string,
}

export interface Component extends CreateComponent, AuthoredModel {
    functions?: Function[],
    failureModes?: FailureMode[],
    system?: System,
}