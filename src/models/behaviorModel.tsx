import VocabularyUtils from "../utils/VocabularyUtils";
import { AbstractModel } from "./abstractModel";
import { Component } from "@models/componentModel";

export const CONTEXT = {
  name: VocabularyUtils.PREFIX + "name",
  requiredBehaviors: VocabularyUtils.PREFIX + "has-required",
  childBehaviors: VocabularyUtils.PREFIX + "has-child-behavior",
  behaviorType: VocabularyUtils.PREFIX + "behavior-type",
  component: VocabularyUtils.PREFIX + "has-component",
  impairedBehavior: VocabularyUtils.PREFIX + "is-impairing",
};

export interface Behavior extends AbstractModel {
  name: string;
  behaviorType?: BehaviorType;
  component?: Component;
  impairedBehaviors?: Behavior[];
  childBehaviors?: Behavior[];
  requiredBehaviors?: Behavior[];
}

export enum BehaviorType {
  ATOMIC = "AtomicBehavior",
  AND = "AndBehavior",
  OR = "OrBehavior",
}
