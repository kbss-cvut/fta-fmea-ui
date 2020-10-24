import VocabularyUtils from "@utils/VocabularyUtils";
import {AbstractModel, CONTEXT as ABSTRACT_CONTEXT} from "@models/abstractModel";
import {CONTEXT as EVENT_CONTEXT, FaultEvent} from "@models/eventModel";

const ctx = {
    "name": VocabularyUtils.PREFIX + "hasName",
    "description": VocabularyUtils.PREFIX + "hasDescription",
    "faultEvent": VocabularyUtils.PREFIX + "prevents",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT, EVENT_CONTEXT);

export interface TakenAction extends AbstractModel {
    name: string,
    description?: string,
    faultEvent: FaultEvent,
}