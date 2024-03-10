import VocabularyUtils from "@utils/VocabularyUtils";
import { FaultEvent, CONTEXT as EVENT_CONTEXT } from "@models/eventModel";
import { AbstractModel, CONTEXT as ABSTRACT_CONTEXT } from "@models/abstractModel";
import { FaultEventScenario, CONTEXT as SCENARIO_CONTEXT } from "@models/faultEventScenario";

const ctx = {
  manifestingEvent: VocabularyUtils.PREFIX + "isManifestedBy",
  faultEventScenarios: VocabularyUtils.PREFIX + "has-scenario",
  name: VocabularyUtils.PREFIX + "hasName",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT, EVENT_CONTEXT, SCENARIO_CONTEXT);

export interface FaultTree extends AbstractModel {
  name: string;
  manifestingEvent: FaultEvent;
  faultEventScenarios: FaultEventScenario[];
}
