import VocabularyUtils from "@utils/VocabularyUtils";
import {Mitigation, CONTEXT as MITIGATION_CONTEXT} from "@models/mitigationModel";
import {FaultEvent, CONTEXT as EVENT_CONTEXT} from "@models/eventModel";
import {CONTEXT as FUNCTION_CONTEXT} from "@models/functionModel";
import {CONTEXT as COMPONENT_CONTEXT} from "@models/componentModel";
import {CONTEXT as ABSTRACT_CONTEXT} from "@models/abstractModel";
import {Behavior, CONTEXT as BEHAVIOR_CONTEXT} from "@models/behaviorModel";

const ctx = {
    "effects": VocabularyUtils.PREFIX + "hasEffect",
    "mitigation": VocabularyUtils.PREFIX + "isMitigatedBy",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT, EVENT_CONTEXT, MITIGATION_CONTEXT, BEHAVIOR_CONTEXT, FUNCTION_CONTEXT, COMPONENT_CONTEXT);

export interface FailureMode extends Behavior {
    mitigation?: Mitigation,
    effects?: FaultEvent[],
}
