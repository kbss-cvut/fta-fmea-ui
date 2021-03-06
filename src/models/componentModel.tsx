import VocabularyUtils from "@utils/VocabularyUtils";
import {Function, CONTEXT as FUNCTION_CONTEXT} from "@models/functionModel";
import {FailureMode, CONTEXT as FAILURE_MODE_CONTEXT} from "@models/failureModeModel";
import {System} from "@models/systemModel";
import {AbstractModel, AbstractUpdateModel, CONTEXT as ABSTRACT_CONTEXT} from "@models/abstractModel";

const ctx = {
    "name": VocabularyUtils.PREFIX + "hasName",
    "functions": VocabularyUtils.PREFIX + "hasFunction",
    "failureModes": VocabularyUtils.PREFIX + "hasFailureMode",
    "linkedComponent": VocabularyUtils.PREFIX + "isPartOf",
    "system": VocabularyUtils.PREFIX + "belongsTo",
};

export const CONTEXT = Object.assign({}, ctx, FUNCTION_CONTEXT, FAILURE_MODE_CONTEXT, ABSTRACT_CONTEXT);

export interface CreateComponent {
    name: string,
    linkedComponent?: Component,
}

export interface UpdateComponent extends AbstractUpdateModel {
    name: string,
}

export interface Component extends CreateComponent, AbstractModel {
    uri: string,
    functions?: Function[],
    failureModes?: FailureMode[],
    system?: System
}