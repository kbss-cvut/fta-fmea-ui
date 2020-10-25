import VocabularyUtils from "@utils/VocabularyUtils";
import {AbstractModel, CONTEXT as ABSTRACT_CONTEXT} from "@models/abstractModel";

const ctx = {
    "probability": VocabularyUtils.PREFIX + "hasProbability",
    "severity": VocabularyUtils.PREFIX + "hasSeverity",
    "detection": VocabularyUtils.PREFIX + "hasDetection",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT);

export interface RiskPriorityNumber extends AbstractModel {
    probability?: number,
    severity?: number,
    detection?: number
}