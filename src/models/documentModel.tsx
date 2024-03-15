import VocabularyUtils from "@utils/VocabularyUtils";
import { AbstractModel, CONTEXT as ABSTRACT_CONTEXT } from "@models/abstractModel";

const ctx = {
  name: VocabularyUtils.PREFIX + "name",
  iri: VocabularyUtils.PREFIX + "iri",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT);

export interface DocumentModel extends AbstractModel {
  iri: string;
  name: string;
}
