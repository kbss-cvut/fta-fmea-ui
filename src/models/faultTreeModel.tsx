import VocabularyUtils from "@utils/VocabularyUtils";
import { FaultEvent, CONTEXT as EVENT_CONTEXT } from "@models/eventModel";
import { AbstractModel, CONTEXT as ABSTRACT_CONTEXT } from "@models/abstractModel";
import { FaultEventScenario, CONTEXT as SCENARIO_CONTEXT } from "@models/faultEventScenario";

const ctx = {
  manifestingEvent: VocabularyUtils.PREFIX + "is-manifested-by",
  faultEventScenarios: VocabularyUtils.PREFIX + "has-scenario",
  name: VocabularyUtils.PREFIX + "name",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT, EVENT_CONTEXT, SCENARIO_CONTEXT);

export interface FaultTree extends AbstractModel {
  name: string;
  manifestingEvent: FaultEvent;
  faultEventScenarios: FaultEventScenario[];
  requiredFailureRate: number;
  system?: {
    name?: string;
    iri?: string;
  };
  calculatedFailureRate?: number;
  fhaBasedFailureRate?: number;
  editor?: {
    username?: string;
    iri?: string;
  };
  modified?: string;
  created?: string;
  subSystem?: {
    name?: string;
    iri?: string;
  };
}
