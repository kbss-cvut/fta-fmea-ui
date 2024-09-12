import JsonLdUtils from "@utils/JsonLdUtils";
import { authHeaders } from "@services/utils/authUtils";
import axiosClient from "@services/utils/axiosUtils";
import {
  FailureModesTable,
  CONTEXT,
  UpdateFailureModesTable,
  FailureModesTableData,
  CreateFailureModesTable,
} from "@models/failureModesTableModel";
import { extractFragment } from "@services/utils/uriIdentifierUtils";
import { FaultEvent } from "@models/eventModel";
import { FailureModesRow } from "@models/failureModesRowModel";
import VocabularyUtils from "@utils/VocabularyUtils";
import { RiskPriorityNumber } from "@models/rpnModel";
import { handleServerError } from "@services/utils/responseUtils";

export const findAll = async (): Promise<FailureModesTable[]> => {
  try {
    const response = await axiosClient.get<FailureModesTable[]>("/failureModesTable/summaries", {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferencesAsArray<FailureModesTable>(response.data, CONTEXT);
  } catch (e) {
    console.log("Failure Modes Table Service - Failed to call /findAll");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.failureModesTable.findAll")));
  }
};

export const update = async (table: UpdateFailureModesTable): Promise<FailureModesTable> => {
  try {
    const response = await axiosClient.put("/failureModesTable", table, {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferences<FailureModesTable>(response.data, CONTEXT);
  } catch (e) {
    console.log("Failure Modes Table Service - Failed to call /update");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.failureModesTable.update")));
  }
};

export const remove = async (tableIri: string): Promise<void> => {
  try {
    const fragment = extractFragment(tableIri);

    await axiosClient.delete(`/failureModesTable/${fragment}`, {
      headers: authHeaders(),
    });
    return new Promise((resolve) => resolve());
  } catch (e) {
    console.log("Failure Modes Table Service - Failed to call /remove");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.failureModesTable.remove")));
  }
};

export const computeTableData = async (tableIri: string): Promise<FailureModesTableData> => {
  try {
    const fragment = extractFragment(tableIri);

    const response = await axiosClient.get(`/failureModesTable/${fragment}/computeTableData`, {
      headers: authHeaders(),
    });
    return new Promise((resolve) => resolve(response.data));
  } catch (e) {
    console.log("Failure Modes Table Service - Failed to call /computeTableData");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.failureModesTable.computeTableData")));
  }
};

export const exportCsv = async (tableIri: string, title: string): Promise<string> => {
  try {
    const fragment = extractFragment(tableIri);

    const response = await axiosClient.get(`/failureModesTable/${fragment}/export`, {
      headers: authHeaders(),
    });

    const type = response.headers["content-type"];
    const blob = new Blob([response.data], { type: type });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = title + ".csv";
    link.click();
  } catch (e) {
    console.log("Failure Modes Table Service - Failed to call /exportCsv");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.failureModesTable.export")));
  }
};

export const createAggregate = async (table: CreateFailureModesTable): Promise<FailureModesTable> => {
  try {
    const createRequest = Object.assign({ "@type": [VocabularyUtils.FAILURE_MODES_TABLE] }, table, {
      "@context": CONTEXT,
    });

    const response = await axiosClient.post(`/failureModesTable`, createRequest, {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferences<FailureModesTable>(response.data, CONTEXT);
  } catch (e) {
    console.log("Failure Modes Table Service - Failed to call /createAggregate");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.failureModesTable.createAggregate")));
  }
};

export const eventPathsToRows = (
  eventPathsMap: Map<number, FaultEvent[]>,
  rpnsMap: Map<number, RiskPriorityNumber>,
): FailureModesRow[] => {
  // this transformation does not follow the FMEA generation rules established in issues/46
  return Array.from(eventPathsMap).map(([key, path]) => {
    const rpn = rpnsMap.get(key);
    return {
      "@type": [VocabularyUtils.FAILURE_MODES_ROW],
      finalEffect: path[path.length - 1],
      localEffect: path[0],
      effects: path.length > 1 ? path.slice(1) : [],
      rpn: {
        "@type": [VocabularyUtils.RPN],
        severity: rpn?.severity,
        occurrence: rpn?.occurrence,
        detection: rpn?.detection,
      },
    } as FailureModesRow;
  });
};
