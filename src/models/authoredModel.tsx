import VocabularyUtils from "@utils/VocabularyUtils";
import {User, CONTEXT as USER_CONTEXT} from "@models/userModel";
import {CONTEXT as ABSTRACT_CONTEXT} from "@models/abstractModel";
import {AbstractModel} from "@models/abstractModel";

const ctx = {
    "authoredBy": VocabularyUtils.PREFIX + "authoredBy",
    "creationDate": VocabularyUtils.PREFIX + "hasCreationDate",
};

export const CONTEXT = Object.assign({}, ctx, USER_CONTEXT, ABSTRACT_CONTEXT);

export interface AuthoredModel extends AbstractModel {
    authoredBy?: User,
    creationDate?: Date,
}