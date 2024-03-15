import VocabularyUtils from "@utils/VocabularyUtils";
import { FaultEvent, CONTEXT as EVENT_CONTEXT } from "@models/eventModel";
import { AbstractModel, AbstractUpdateModel, CONTEXT as ABSTRACT_CONTEXT } from "./abstractModel";
import { CONTEXT as RPN_CONTEXT, RiskPriorityNumber } from "@models/rpnModel";

const ctx = {
  finalEffect: VocabularyUtils.PREFIX + "has-final-effect",
  localEffect: VocabularyUtils.PREFIX + "has-local-effect",
  effects: VocabularyUtils.PREFIX + "has-effect",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT, EVENT_CONTEXT, RPN_CONTEXT);

export interface FailureModesRow extends AbstractModel {
  finalEffect: FaultEvent;
  localEffect: FaultEvent;
  effects: FaultEvent[];
  rpn: RiskPriorityNumber;
}

export interface EditRowRpn extends AbstractUpdateModel {
  severity?: number;
  occurrence?: number;
  detection?: number;
}
