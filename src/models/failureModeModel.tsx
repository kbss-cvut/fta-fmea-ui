import VocabularyUtils from "@utils/VocabularyUtils";
import {Mitigation, CONTEXT as MITIGATION_CONTEXT} from "@models/mitigationModel";
import {AuthoredModel, CONTEXT as AUTHORED_CONTEXT} from "@models/authoredModel";
import {FaultEvent, CONTEXT as EVENT_CONTEXT} from "@models/eventModel";

const ctx = {
    "manifestingNode": VocabularyUtils.PREFIX + "isManifestedBy",
    "mitigation": VocabularyUtils.PREFIX + "isMitigatedBy",
};

export const CONTEXT = Object.assign({}, ctx, AUTHORED_CONTEXT, EVENT_CONTEXT, MITIGATION_CONTEXT);

export interface FailureMode extends AuthoredModel {
    manifestingEvent: FaultEvent,
    mitigation?: Mitigation[]
}