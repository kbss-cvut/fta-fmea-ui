import VocabularyUtils from "@utils/VocabularyUtils";
import { CONTEXT as ABSTRACT_CONTEXT } from "@models/abstractModel";
import { Behavior, CONTEXT as BEHAVIOR_CONTEXT } from "@models/behaviorModel";

const ctx = {
  description: VocabularyUtils.PREFIX + "description",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT, BEHAVIOR_CONTEXT);

export interface Mitigation extends Behavior {
  description?: string;
}

export interface UpdateMitigation extends Mitigation {
  failureModesRowUri?: string;
  failureModeUri?: string;
}
