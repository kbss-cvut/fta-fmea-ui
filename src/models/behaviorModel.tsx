import VocabularyUtils from "../utils/VocabularyUtils";
import { AbstractModel } from "./abstractModel";
import { Component } from "@models/componentModel";

export const CONTEXT = {
  name: VocabularyUtils.PREFIX + "hasName",
  requiredBehaviors: VocabularyUtils.PREFIX + "requires",
  childBehaviors: VocabularyUtils.PREFIX + "hasChildBehavior",
  behaviorType: VocabularyUtils.PREFIX + "hasBehaviorType",
  component: VocabularyUtils.PREFIX + "hasComponent",
  impairedBehavior: VocabularyUtils.PREFIX + "impairs",
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
