import VocabularyUtils from "@utils/VocabularyUtils";
import {User} from "@models/userModel";

// TODO provide user context as well to parse 'authoredBy'?

export const CONTEXT = {
    "iri": "@id",
    "name": VocabularyUtils.PREFIX + "hasName",
    "authoredBy": VocabularyUtils.PREFIX + "authoredBy",
    "creationDate": VocabularyUtils.PREFIX + "creationDate",
    "types": "@type"
};

export interface Component {
    iri: string,
    name: string,
    authoredBy: User,
    creationDate: Date,
    types?: string[]
}