import VocabularyUtils from "@utils/VocabularyUtils";
import {AuthoredModel, CONTEXT as AUTHORED_CONTEXT} from "@models/authoredModel";
import {Function, CONTEXT as FUNCTION_CONTEXT} from "@models/functionModel";

const ctx = {
    "name": VocabularyUtils.PREFIX + "hasName",
    "functions": VocabularyUtils.PREFIX + "hasFunction",
};

export const CONTEXT = Object.assign({}, ctx, AUTHORED_CONTEXT, FUNCTION_CONTEXT);

export interface CreateComponent {
    name: string,
}

export interface Component extends CreateComponent, AuthoredModel {
    functions?: Function[]
}