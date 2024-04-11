import JsonLdUtils from "@utils/JsonLdUtils";
import { authHeaders } from "@services/utils/authUtils";
import axiosClient from "@services/utils/axiosUtils";
import { CONTEXT, FaultTree } from "@models/faultTreeModel";
import { CONTEXT as EVENT_CONTEXT, FaultEvent } from "@models/eventModel";
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
    const defaultMessage = "Failed to load fault trees";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
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
    const defaultMessage = "Failed to find fault tree";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
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
    const defaultMessage = "Failed to create fault tree";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};

export const update = async (faultTree: FaultTree): Promise<FaultTree> => {
  try {
    const updateRequest = Object.assign({}, faultTree, { "@context": CONTEXT });

    const response = await axiosClient.put("/faultTrees", updateRequest, {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferences<FaultTree>(response.data, CONTEXT);
  } catch (e) {
    console.log("Fault Tree Service - Failed to call /update");
    const defaultMessage = "Failed to update fault tree";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
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
    const defaultMessage = "Failed to remove fault tree";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};

export const getReusableEvents = async (faultTreeIri: string): Promise<FaultEvent[]> => {
  try {
    const fragment = extractFragment(faultTreeIri);
    const response = await axiosClient.get(`/faultTrees/${fragment}/reusableEvents`, {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferencesAsArray<FaultEvent>(response.data, EVENT_CONTEXT);
  } catch (e) {
    console.log("Fault Tree Service - Failed to call /getReusableEvents");
    const defaultMessage = "Failed to find reusable fault events";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
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
    const defaultMessage = "Failed to load tree paths";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
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
    const defaultMessage = "Failed to create failure modes table";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
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
    const defaultMessage = "Failed to load failure modes table";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
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
    const defaultMessage = "Failed to load all tree paths";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};

export const calculateCutSets = async (faultTreeUri: string) => {
  try {
    const fragment = extractFragment(faultTreeUri);
    const response = await axiosClient.put(`/faultTrees/${fragment}/evaluate`, null, {
      headers: authHeaders(),
    });
    return response;
  } catch (e) {
    console.log("Fault Tree Service - Failed to call /cutsets");
    const defaultMessage = "Failed to calculate cutsets of fault tree";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};
