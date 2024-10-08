import VocabularyUtils from "@utils/VocabularyUtils";
import { FaultEvent, CONTEXT as EVENT_CONTEXT } from "@models/eventModel";
import { AbstractModel, CONTEXT as ABSTRACT_CONTEXT } from "@models/abstractModel";
import { FaultEventScenario, CONTEXT as SCENARIO_CONTEXT } from "@models/faultEventScenario";
import { OperationalDataFilter, CONTEXT as FILTER_CONTEXT } from "@models/operationalDataFilterModel";
import { System } from "@models/systemModel";
import { Status } from "@utils/constants";

const ctx = {
  manifestingEvent: VocabularyUtils.PREFIX + "is-manifested-by",
  faultEventScenarios: VocabularyUtils.PREFIX + "has-scenario",
  operationalDataFilter: VocabularyUtils.PREFIX + "has-operational-data-filter",
  name: VocabularyUtils.PREFIX + "name",
  status: VocabularyUtils.PREFIX + "status",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT, EVENT_CONTEXT, SCENARIO_CONTEXT, FILTER_CONTEXT);

export interface FaultTree extends AbstractModel {
  name: string;
  manifestingEvent: FaultEvent;
  faultEventScenarios: FaultEventScenario[];
  requiredFailureRate: number;
  system?: System;
  calculatedFailureRate?: number;
  fhaBasedFailureRate?: number;
  creator?: {
    username?: string;
  };
  editor?: {
    username?: string;
  };
  modified?: string;
  created?: string;
  status?: string;
  subSystem?: {
    name?: string;
  };
  operationalDataFilter: OperationalDataFilter;
}

const isCalculationOutOfSync = (faultTree: FaultTree) => {
  return !!faultTree?.status && faultTree.status !== Status.OK;
};

const isExperimentalCalculation = (faultTree: FaultTree) => {
  return (
    !!faultTree?.operationalDataFilter?.minOperationalHours &&
    !!faultTree?.system?.operationalDataFilter?.minOperationalHours &&
    faultTree.operationalDataFilter.minOperationalHours !== faultTree?.system?.operationalDataFilter.minOperationalHours
  );
};

export interface FaultTreeStatus {
  outOfSync: boolean;
  experimental: boolean;
  statusCodes: string[];
  isOk: boolean;
}

export const getFaultTreeCalculationStatus = (faultTree: FaultTree): FaultTreeStatus => {
  const faultTreeStatus = {
    outOfSync: isCalculationOutOfSync(faultTree),
    experimental: isExperimentalCalculation(faultTree),
    statusCodes: [],
    isOk: false,
  };
  faultTreeStatus.statusCodes = [
    faultTreeStatus.outOfSync ? "faultEventMessage.outOfSyncValue" : null,
    faultTreeStatus.experimental ? "faultEventMessage.experimental" : null,
  ].filter((c) => c !== null);
  faultTreeStatus.isOk = !faultTreeStatus.outOfSync && !faultTreeStatus.experimental;
  return faultTreeStatus;
};
