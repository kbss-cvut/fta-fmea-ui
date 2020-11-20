import VocabularyUtils from "@utils/VocabularyUtils";
import {AuthoredModel, CONTEXT as AUTHORED_CONTEXT} from "@models/authoredModel";
import {FaultEvent, CONTEXT as EVENT_CONTEXT} from "@models/eventModel";

const ctx = {
    "manifestingEvent": VocabularyUtils.PREFIX + "isManifestedBy",
    "name": VocabularyUtils.PREFIX + "hasName",
};

export const CONTEXT = Object.assign({}, ctx, AUTHORED_CONTEXT, EVENT_CONTEXT);

export interface FaultTree extends AuthoredModel {
    name: string,
    manifestingEvent: FaultEvent,
}