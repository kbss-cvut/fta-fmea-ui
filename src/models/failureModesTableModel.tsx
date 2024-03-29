import VocabularyUtils from "@utils/VocabularyUtils";
import { AbstractModel, AbstractUpdateModel, CONTEXT as ABSTRACT_CONTEXT } from "./abstractModel";
import { FailureModesRow, CONTEXT as FAILURE_MODES_ROW_CONTEXT } from "./failureModesRowModel";
import { FaultTree, CONTEXT as FAULT_TREE_CONTEXT } from "./faultTreeModel";
import { FailureMode, CONTEXT as FAILURE_MODES_CONTEXT } from "@models/failureModeModel";

const ctx = {
  name: VocabularyUtils.PREFIX + "name",
  tree: VocabularyUtils.PREFIX + "is-derived-from",
  rows: VocabularyUtils.PREFIX + "has-row",
};

export const CONTEXT = Object.assign(
  {},
  ctx,
  ABSTRACT_CONTEXT,
  FAULT_TREE_CONTEXT,
  FAILURE_MODES_ROW_CONTEXT,
  FAILURE_MODES_CONTEXT,
);

export interface CreateFailureModesTable extends AbstractModel {
  name: string;
  rows: FailureModesRow[];
}

export interface UpdateFailureModesTable extends AbstractUpdateModel {
  name: string;
}

export interface FailureModesTable extends CreateFailureModesTable {
  tree: FaultTree;
  rows: FailureModesRow[];
}

export interface FailureModesTableData {
  name: string;
  rows: any;
  columns: any;
  failureModes: FailureMode[];
}
