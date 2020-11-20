import VocabularyUtils from "@utils/VocabularyUtils";
import {Mitigation, CONTEXT as MITIGATION_CONTEXT} from "@models/mitigationModel";
import {AuthoredModel, CONTEXT as AUTHORED_CONTEXT} from "@models/authoredModel";
import {FaultEvent, CONTEXT as EVENT_CONTEXT} from "@models/eventModel";
import {Function, CONTEXT as FUNCTION_CONTEXT} from "@models/functionModel";

const ctx = {
    "influencedFunction": VocabularyUtils.PREFIX + "influences",
    "effects": VocabularyUtils.PREFIX + "hasEffect",
    "mitigation": VocabularyUtils.PREFIX + "isMitigatedBy",
};

export const CONTEXT = Object.assign({}, ctx, AUTHORED_CONTEXT, EVENT_CONTEXT, MITIGATION_CONTEXT, FUNCTION_CONTEXT);

export interface CreateFailureMode extends AuthoredModel {
    name: string,
    influencedFunction?: Function,
    effects?: any[],
    mitigation?: Mitigation[]
}

export interface FailureMode extends AuthoredModel {
    name: string,
    influencedFunction?: Function,
    effects?: FaultEvent[],
    mitigation?: Mitigation[]
}