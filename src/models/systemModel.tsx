import VocabularyUtils from "@utils/VocabularyUtils";
import { Component, CONTEXT as COMPONENT_CONTEXT } from "@models/componentModel";
import { AbstractModel, CONTEXT as ABSTRACT_CONTEXT } from "@models/abstractModel";
import { OperationalDataFilter, CONTEXT as FILTER_CONTEXT } from "@models/operationalDataFilterModel";

const ctx = {
  name: VocabularyUtils.PREFIX + "name",
  globalOperationalDataFilter: VocabularyUtils.PREFIX + "has-global-operational-data-filter",
  operationalDataFilter: VocabularyUtils.PREFIX + "has-operational-data-filter",
  components: VocabularyUtils.PREFIX + "has-part-component",
};

export const CONTEXT = Object.assign({}, ctx, COMPONENT_CONTEXT, ABSTRACT_CONTEXT, FILTER_CONTEXT);

export interface System extends AbstractModel {
  name: string;
  iri?: string;
  components?: Component[];
  globalOperationalDataFilter: OperationalDataFilter;
  operationalDataFilter: OperationalDataFilter;
}
