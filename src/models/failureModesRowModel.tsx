import VocabularyUtils from "@utils/VocabularyUtils";
import {FaultEvent, CONTEXT as EVENT_CONTEXT} from "@models/eventModel";
import {AbstractModel, CONTEXT as ABSTRACT_CONTEXT} from "./abstractModel";

const ctx = {
    "localEffect": VocabularyUtils.PREFIX + "hasLocalEffect",
    "effects": VocabularyUtils.PREFIX + "hasEffect",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT, EVENT_CONTEXT);

export interface FailureModesRow extends AbstractModel {
    localEffect: FaultEvent,
    effects: FaultEvent[]
}