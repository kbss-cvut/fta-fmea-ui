import VocabularyUtils from "@utils/VocabularyUtils";
import {Mitigation, CONTEXT as MITIGATION_CONTEXT} from "@models/mitigationModel";
import {FaultEvent, CONTEXT as EVENT_CONTEXT} from "@models/eventModel";
import {Function, CONTEXT as FUNCTION_CONTEXT} from "@models/functionModel";
import {Component,CONTEXT as COMPONENT_CONTEXT} from "@models/componentModel";
import {AbstractModel, CONTEXT as ABSTRACT_CONTEXT} from "@models/abstractModel";

const ctx = {
    "impairedBehaviors": VocabularyUtils.PREFIX + "impairs",
    "effects": VocabularyUtils.PREFIX + "hasEffect",
    "mitigation": VocabularyUtils.PREFIX + "isMitigatedBy",
    "component": VocabularyUtils.PREFIX + "hasComponent",
    "name" : VocabularyUtils.PREFIX + "hasName",
    "requiredBehaviors": VocabularyUtils.PREFIX + "requires",
    "childBehaviors": VocabularyUtils.PREFIX + "hasChildBehavior",
    "behaviorType": VocabularyUtils.PREFIX + "hasBehaviorType"
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT, EVENT_CONTEXT, MITIGATION_CONTEXT, FUNCTION_CONTEXT, COMPONENT_CONTEXT);

export interface FailureMode extends AbstractModel {
    name: string,
    behaviorType: BehaviorType,
    impairedBehaviors?: Function[],
    requiredBehaviors?: FailureMode[],
    childBehaviors?: FailureMode[],
    component: Component,
    mitigation?: Mitigation,
    effects?: FaultEvent[],
}

export enum BehaviorType {
    ATOMIC = "AtomicBehavior",
    AND = "AndBehavior",
    OR = "OrBehavior"
}