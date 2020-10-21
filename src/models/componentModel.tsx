import VocabularyUtils from "@utils/VocabularyUtils";
import {User, CONTEXT as USER_CONTEXT} from "@models/userModel";

const ctx = {
    "iri": "@id",
    "name": VocabularyUtils.PREFIX + "hasName",
    "authoredBy": VocabularyUtils.PREFIX + "authoredBy",
    "creationDate": VocabularyUtils.PREFIX + "hasCreationDate",
    "functions": VocabularyUtils.PREFIX + "hasFunction",
    "types": "@type"
};

export const CONTEXT = Object.assign({}, USER_CONTEXT, ctx);

export interface CreateComponent {
    name: string,
}

export interface Component extends CreateComponent{
    iri: string,
    authoredBy: User,
    creationDate: Date,
    types?: string[]
}