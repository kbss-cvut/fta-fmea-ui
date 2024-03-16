import VocabularyUtils from "@utils/VocabularyUtils";
import { AbstractModel, CONTEXT as ABSTRACT_CONTEXT } from "@models/abstractModel";
import { FailureMode, CONTEXT as FAILURE_MODE_CONTEXT } from "@models/failureModeModel";
import { Rectangle, CONTEXT as RECTANGLE_CONTEXT, PREFIX as DIAGRAM_PREFIX } from "@models/utils/Rectangle";

const ctx = {
  name: VocabularyUtils.PREFIX + "hasName",
  description: VocabularyUtils.PREFIX + "hasDescription",
  takenAction: VocabularyUtils.PREFIX + "isPreventedBy",
  gateType: VocabularyUtils.PREFIX + "hasGateType",
  eventType: VocabularyUtils.PREFIX + "hasFaultEventType",
  rpn: VocabularyUtils.PREFIX + "hasRPN",
  probability: VocabularyUtils.PREFIX + "hasProbability",
  children: VocabularyUtils.PREFIX + "hasChildren",
  failureMode: VocabularyUtils.PREFIX + "hasFailureMode",
  sequenceProbability: VocabularyUtils.PREFIX + "hasSequenceProbability",
  childrenSequence: VocabularyUtils.PREFIX + "hasChildrenSequence",
  rectangle: DIAGRAM_PREFIX + "has-rectangle",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT, FAILURE_MODE_CONTEXT, RECTANGLE_CONTEXT);

export enum EventType {
  BASIC = "BASIC",
  EXTERNAL = "EXTERNAL",
  UNDEVELOPED = "UNDEVELOPED",
  CONDITIONING = "CONDITIONING",
  INTERMEDIATE = "INTERMEDIATE",
}

export interface FaultEvent extends AbstractModel {
  eventType: EventType;
  name: string;
  description?: string;
  gateType?: GateType;
  probability?: number;
  children?: FaultEvent[];
  failureMode?: FailureMode;
  sequenceProbability?: number;
  childrenSequence?: any;
  rectangle?: Rectangle;
  probabilityRequirement?: number;
  iri?: string;
}

export enum GateType {
  AND = "AND",
  OR = "OR",
  XOR = "XOR",
  PRIORITY_AND = "PRIORITY_AND",
  INHIBIT = "INHIBIT",
  UNUSED = "UNUSED",
}

// returns true as first argument of array if option should be enabled in select
export const gateTypeValues = (): [boolean, GateType][] =>
  Object.values(GateType).map((value) => {
    if (value === GateType.UNUSED) {
      return [false, GateType.UNUSED];
    } else {
      return [true, value];
    }
  });
