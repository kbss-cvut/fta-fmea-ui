import VocabularyUtils from "@utils/VocabularyUtils";
import {FaultEvent, CONTEXT as EVENT_CONTEXT} from "@models/eventModel";
import {AbstractModel, CONTEXT as ABSTRACT_CONTEXT} from "./abstractModel";

const ctx = {
    "hasLocalEffect": VocabularyUtils.PREFIX + "hasLocalEffect",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT, EVENT_CONTEXT);

export interface FailureModesRow extends AbstractModel {
    hasLocalEffect: FaultEvent,
}