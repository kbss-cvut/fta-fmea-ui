import VocabularyUtils from "@utils/VocabularyUtils";
import { Mitigation } from "@models/mitigationModel";
import { FaultEvent } from "@models/eventModel";
import {
  ABSTRACT_CONTEXT,
  FUNCTION_CONTEXT,
  BEHAVIOR_CONTEXT,
  EVENT_CONTEXT,
  COMPONENT_CONTEXT,
  MITIGATION_CONTEXT,
} from "@models/modelsContext";
import { Behavior } from "@models/behaviorModel";

const ctx = {
  effects: VocabularyUtils.PREFIX + "has-effect",
  mitigation: VocabularyUtils.PREFIX + "is-mitigated-by",
  failureModeType: VocabularyUtils.PREFIX + "failure-mode-type",
};

export const CONTEXT = Object.assign(
  {},
  ctx,
  ABSTRACT_CONTEXT,
  EVENT_CONTEXT,
  MITIGATION_CONTEXT,
  BEHAVIOR_CONTEXT,
  FUNCTION_CONTEXT,
  COMPONENT_CONTEXT,
);

export interface FailureMode extends Behavior {
  mitigation?: Mitigation;
  effects?: FaultEvent[];
  failureModeType?: FailureModeType;
}

export enum FailureModeType {
  FailureMode = "FailureMode",
  FailureModeCause = "FailureModeCause",
}
