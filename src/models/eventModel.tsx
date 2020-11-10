import VocabularyUtils from "@utils/VocabularyUtils";
import {AbstractModel, CONTEXT as ABSTRACT_CONTEXT} from "@models/abstractModel";
import {CONTEXT as RPN_CONTEXT, RiskPriorityNumber} from "@models/rpnModel";

const ctx = {
    "name": VocabularyUtils.PREFIX + "hasName",
    "description": VocabularyUtils.PREFIX + "hasDescription",
    "takenAction": VocabularyUtils.PREFIX + "isPreventedBy",
    "gateType": VocabularyUtils.PREFIX + "hasGateType",
    "eventType": VocabularyUtils.PREFIX + "hasFaultEventType",
    "rpn": VocabularyUtils.PREFIX + "hasRPN",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT, RPN_CONTEXT);

export interface Event extends AbstractModel {
}

export enum EventType {
    TOP_EVENT = "TOP_EVENT",
    BASIC = "BASIC",
    EXTERNAL = "EXTERNAL",
    UNDEVELOPED = "UNDEVELOPED",
    CONDITIONING = "CONDITIONING",
    INTERMEDIATE = "INTERMEDIATE"
}

export interface FaultEvent extends Event {
    eventType: EventType,
    name: string,
    description?: string,
    rpn: RiskPriorityNumber,
}

export enum GateType {
    AND = "AND",
    OR = "OR",
    XOR = "XOR",
    PRIORITY_AND = "PRIORITY_AND",
    INHIBIT = "INHIBIT",
    K_N = "K_N"
}

export interface Gate extends Event {
    gateType: GateType,
}

export interface CreateGate {
    gateType?: GateType,
}