import VocabularyUtils from "@utils/VocabularyUtils";
import { Function } from "@models/functionModel";
import { FailureMode } from "@models/failureModeModel";
import { System } from "@models/systemModel";
import { AbstractModel, AbstractUpdateModel, CONTEXT as ABSTRACT_CONTEXT } from "@models/abstractModel";
import { FAILURE_MODE_CONTEXT, FUNCTION_CONTEXT } from "@models/modelsContext";

const ctx = {
  name: VocabularyUtils.PREFIX + "name",
  functions: VocabularyUtils.PREFIX + "has-function",
  failureModes: VocabularyUtils.PREFIX + "has-failure-mode",
  linkedComponent: VocabularyUtils.PREFIX + "is-part-of",
  system: VocabularyUtils.PREFIX + "belongsTo",
};

export const CONTEXT = Object.assign({}, ctx, FUNCTION_CONTEXT, FAILURE_MODE_CONTEXT, ABSTRACT_CONTEXT);

export interface CreateComponent {
  name: string;
  linkedComponent?: Component;
}

export interface UpdateComponent extends AbstractUpdateModel {
  name: string;
}

export interface Component extends CreateComponent, AbstractModel {
  uri: string;
  functions?: Function[];
  failureModes?: FailureMode[];
  system?: System;
}
