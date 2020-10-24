import VocabularyUtils from "@utils/VocabularyUtils";
import {FailureMode, CONTEXT as FAILURE_MODE_CONTEXT} from "@models/failureModeModel";
import {AbstractModel, CONTEXT as ABSTRACT_CONTEXT} from "@models/abstractModel";

const ctx = {
    "name": VocabularyUtils.PREFIX + "hasName",
    "failureModes": VocabularyUtils.PREFIX + "hasFailureMode",
};

export const CONTEXT = Object.assign({}, ABSTRACT_CONTEXT, FAILURE_MODE_CONTEXT, ctx);

export interface Function extends AbstractModel {
    name: string,
    failureModes: FailureMode[],
}