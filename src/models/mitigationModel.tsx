import VocabularyUtils from "@utils/VocabularyUtils";
import {AbstractModel, CONTEXT as ABSTRACT_CONTEXT} from "@models/abstractModel";

const ctx = {
    "name": VocabularyUtils.PREFIX + "hasName",
    "description": VocabularyUtils.PREFIX + "hasDescription",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT);

export interface Mitigation extends AbstractModel {
    name: string,
    description?: string,
}