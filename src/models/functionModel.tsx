import VocabularyUtils from "@utils/VocabularyUtils";
import {FailureMode, CONTEXT as FAILURE_MODE_CONTEXT} from "@models/failureModeModel";
import {AbstractModel, CONTEXT as ABSTRACT_CONTEXT} from "@models/abstractModel";

const ctx = {
    "name": VocabularyUtils.PREFIX + "hasName",
    "failureModes": VocabularyUtils.PREFIX + "hasFailureMode",
    "requiredFunctions": VocabularyUtils.PREFIX + "requires"
};

export const CONTEXT = Object.assign({}, ABSTRACT_CONTEXT, FAILURE_MODE_CONTEXT, ctx);

export interface CreateFunction extends AbstractModel {
    name: string,
}

export interface Function extends CreateFunction {
    failureModes: FailureMode[],
    requiredFunctions: Function[]
}