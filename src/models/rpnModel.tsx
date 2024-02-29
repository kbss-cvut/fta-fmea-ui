import VocabularyUtils from "@utils/VocabularyUtils";
import { AbstractModel, CONTEXT as ABSTRACT_CONTEXT } from "@models/abstractModel";

const ctx = {
  severity: VocabularyUtils.PREFIX + "hasSeverity",
  occurrence: VocabularyUtils.PREFIX + "hasOccurrence",
  detection: VocabularyUtils.PREFIX + "hasDetection",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT);

export interface RiskPriorityNumber extends AbstractModel {
  severity?: number;
  occurrence?: number;
  detection?: number;
}
