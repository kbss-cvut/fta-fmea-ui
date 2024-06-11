import VocabularyUtils from "@utils/VocabularyUtils";
import { AbstractModel, CONTEXT as ABSTRACT_CONTEXT } from "@models/abstractModel";

const ctx = {
  minOperationalHours: VocabularyUtils.PREFIX + "min-operational-hours",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT);

export interface OperationalDataFilter extends AbstractModel {
  minOperationalHours: number;
}
