import VocabularyUtils from "@utils/VocabularyUtils";
import { Component, CONTEXT as COMPONENT_CONTEXT } from "@models/componentModel";
import { AbstractModel, CONTEXT as ABSTRACT_CONTEXT } from "@models/abstractModel";

const ctx = {
  name: VocabularyUtils.PREFIX + "hasName",
  components: VocabularyUtils.PREFIX + "hasPartComponent",
};

export const CONTEXT = Object.assign({}, ctx, COMPONENT_CONTEXT, ABSTRACT_CONTEXT);

export interface System extends AbstractModel {
  name: string;
  components?: Component[];
}
