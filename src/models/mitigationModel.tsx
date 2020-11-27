import VocabularyUtils from "@utils/VocabularyUtils";
import {AbstractModel, CONTEXT as ABSTRACT_CONTEXT} from "@models/abstractModel";

const ctx = {
    "description": VocabularyUtils.PREFIX + "hasDescription",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT);

export interface Mitigation extends AbstractModel {
    description?: string,
}