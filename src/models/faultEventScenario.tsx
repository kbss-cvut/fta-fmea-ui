import { AbstractModel, CONTEXT as ABSTRACT_CONTEXT } from "./abstractModel";
import { FaultEvent } from "./eventModel";
import VocabularyUtils from "../utils/VocabularyUtils";

const ctx = {
  probability: VocabularyUtils.PREFIX + "probability",
  scenarioParts: VocabularyUtils.PREFIX + "has-part",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT);

export interface FaultEventScenario extends AbstractModel {
  probability?: number;
  scenarioParts?: FaultEvent[];
}
