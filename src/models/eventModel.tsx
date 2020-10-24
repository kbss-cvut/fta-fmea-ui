import VocabularyUtils from "@utils/VocabularyUtils";
import {AbstractModel, CONTEXT as ABSTRACT_CONTEXT} from "@models/abstractModel";
import {TakenAction} from "@models/takenActionModel";

const ctx = {
    "name": VocabularyUtils.PREFIX + "hasName",
    "description": VocabularyUtils.PREFIX + "hasDescription",
    "probability": VocabularyUtils.PREFIX + "hasProbability",
    "takenAction": VocabularyUtils.PREFIX + "isPreventedBy",
    "gateType": VocabularyUtils.PREFIX + "hasGateType",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT);

export interface Event extends AbstractModel {
}

export enum EventType {
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
    probability?: number,
    takenAction?: TakenAction
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