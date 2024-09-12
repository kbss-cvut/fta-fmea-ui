import JsonLdUtils from "@utils/JsonLdUtils";
import { authHeaders } from "@services/utils/authUtils";
import axiosClient from "@services/utils/axiosUtils";
import { CONTEXT, FaultTree } from "@models/faultTreeModel";
import { CONTEXT as EVENT_CONTEXT, FaultEvent } from "@models/eventModel";
import { CONTEXT as FILTER_CONTEXT, OperationalDataFilter } from "@models/operationalDataFilterModel";
import VocabularyUtils from "@utils/VocabularyUtils";
import { extractFragment } from "@services/utils/uriIdentifierUtils";
import {
  CONTEXT as FAILURE_MODES_TABLE_CONTEXT,
  CreateFailureModesTable,
  FailureModesTable,
} from "@models/failureModesTableModel";
import { handleServerError } from "@services/utils/responseUtils";

export const findAll = async (): Promise<FaultTree[]> => {
  try {
    const response = await axiosClient.get<FaultTree[]>("/faultTrees/summaries", {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferencesAsArray<FaultTree>(response.data, CONTEXT);
  } catch (e) {
    console.log("Fault Tree Service - Failed to call /findAll");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.faultTree.findAll")));
  }
};

export const find = async (faultTreeUri: string): Promise<FaultTree> => {
  try {
    const fragment = extractFragment(faultTreeUri);
    const response = await axiosClient.get<FaultTree[]>(`/faultTrees/${fragment}`, {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferences<FaultTree>(response.data, CONTEXT);
  } catch (e) {
    console.log("Fault Tree Service - Failed to call /find");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.faultTree.find")));
  }
};

export const create = async (faultTree: FaultTree): Promise<FaultTree> => {
  try {
    const createRequest = Object.assign({ "@type": [VocabularyUtils.FAULT_TREE] }, faultTree, { "@context": CONTEXT });

    const response = await axiosClient.post("/faultTrees", createRequest, {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferences<FaultTree>(response.data, CONTEXT);
  } catch (e) {
    console.log("Fault Tree Service - Failed to call /create");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.faultTree.create")));
  }
};

export const update = async (faultTree: FaultTree): Promise<FaultTree> => {
  try {
    const updateRequest = Object.assign({}, faultTree, { "@context": CONTEXT });
    updateRequest.calculatedFailureRate = null;
    updateRequest.fhaBasedFailureRate = null;
    updateRequest.requiredFailureRate = null;
    const response = await axiosClient.put("/faultTrees", updateRequest, {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferences<FaultTree>(response.data, CONTEXT);
  } catch (e) {
    console.log("Fault Tree Service - Failed to call /update");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.faultTree.update")));
  }
};

export const remove = async (faultTreeIri: string): Promise<void> => {
  try {
    const fragment = extractFragment(faultTreeIri);

    await axiosClient.delete(`/faultTrees/${fragment}`, {
      headers: authHeaders(),
    });
    return new Promise((resolve) => resolve());
  } catch (e) {
    console.log("Fault Tree Service - Failed to call /remove");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.faultTree.remove")));
  }
};

export const getRootReusableEvents = async (systemIri: string): Promise<FaultEvent[]> => {
  try {
    const fragment = extractFragment(systemIri);
    const response = await axiosClient.get(`/faultEvents/top-fault-events/${fragment}`, {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferencesAsArray<FaultEvent>(response.data, EVENT_CONTEXT);
  } catch (e) {
    console.log("Fault Tree Service - Failed to call /getRootReusableEvents");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.faultEvent.getRootReusable")));
  }
};

export const getAllReusableEvents = async (faultTreeIri: string): Promise<FaultEvent[]> => {
  try {
    const fragment = extractFragment(faultTreeIri);
    const response = await axiosClient.get(`/faultEvents/all-fault-events/${fragment}`, {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferencesAsArray<FaultEvent>(response.data, EVENT_CONTEXT);
  } catch (e) {
    console.log("Fault Tree Service - Failed to call /getAllReusableEvents");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.faultEvent.getRootReusable")));
  }
};

export const getTreePaths = async (faultTreeIri: string): Promise<[FaultEvent[]]> => {
  try {
    const fragment = extractFragment(faultTreeIri);
    const response = await axiosClient.get(`/faultTrees/${fragment}/treePaths`, {
      headers: authHeaders(),
    });

    const parseData = async (data) => {
      return Promise.all(
        data.map((row) => JsonLdUtils.compactAndResolveReferencesAsArray<FaultEvent>(row, EVENT_CONTEXT)),
      );
    };

    // @ts-ignore
    return await parseData(response.data);
  } catch (e) {
    console.log("Fault Tree Service - Failed to call /getTreePaths");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.faultTree.getTreePaths")));
  }
};

export const createFailureModesTable = async (
  faultTreeIri: string,
  failureModesTable: CreateFailureModesTable,
): Promise<FailureModesTable> => {
  try {
    const createRequest = Object.assign({ "@type": [VocabularyUtils.FAILURE_MODES_TABLE] }, failureModesTable, {
      "@context": FAILURE_MODES_TABLE_CONTEXT,
    });

    const fragment = extractFragment(faultTreeIri);
    const response = await axiosClient.post(`/faultTrees/${fragment}/failureModesTable`, createRequest, {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferences<FailureModesTable>(response.data, FAILURE_MODES_TABLE_CONTEXT);
  } catch (e) {
    console.log("Fault Tree Service - Failed to call /createFailureModesTable");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.failureModesTable.create")));
  }
};

export const findFailureModesTable = async (faultTreeIri: string): Promise<FailureModesTable> => {
  try {
    const fragment = extractFragment(faultTreeIri);
    const response = await axiosClient.get<FailureModesTable>(`/faultTrees/${fragment}/failureModesTable`, {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferences<FailureModesTable>(response.data, FAILURE_MODES_TABLE_CONTEXT);
  } catch (e) {
    console.log("Fault Tree Service - Failed to call /findFailureModesTable");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.failureModesTable.findAll")));
  }
};

export const getTreePathsAggregate = async (): Promise<[FaultEvent[]]> => {
  try {
    const response = await axiosClient.get("/faultTrees/treeAggregate/treePathsAggregate", {
      headers: authHeaders(),
    });

    const parseData = async (data) => {
      return Promise.all(
        data.map((row) => JsonLdUtils.compactAndResolveReferencesAsArray<FaultEvent>(row, EVENT_CONTEXT)),
      );
    };

    // @ts-ignore
    return await parseData(response.data);
  } catch (e) {
    console.log("Fault Tree Service - Failed to call /getTreePathsAggregate");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.faultTree.getTreePathsAggregate")));
  }
};

export const calculateCutSets = async (faultTreeUri: string, operationalDataFilter: OperationalDataFilter) => {
  try {
    const fragment = extractFragment(faultTreeUri);
    const filter = Object.assign({}, operationalDataFilter, { "@context": FILTER_CONTEXT });

    const response = await axiosClient.put(`/faultTrees/${fragment}/evaluate`, filter, {
      headers: authHeaders(),
    });
    return response;
  } catch (e) {
    console.log("Fault Tree Service - Failed to call /cutsets");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.faultTree.calculateCutSets")));
  }
};

export const findAllWithFilters = async (filters: { label?: string; snsLabel?: string }): Promise<FaultTree[]> => {
  try {
    const query = new URLSearchParams(filters).toString();
    const response = await axiosClient.get<FaultTree[]>(`/faultTrees/summaries?${query}`, {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferencesAsArray<FaultTree>(response.data, CONTEXT);
  } catch (e) {
    console.log("Fault Tree Service - Failed to call /findAllWithFilters");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.faultTree.findAllWithFilters")));
  }
};
