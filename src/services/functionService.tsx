import axiosClient from "@services/utils/axiosUtils";
import { authHeaders } from "@services/utils/authUtils";
import { extractFragment } from "@services/utils/uriIdentifierUtils";
import { UriReference } from "@models/utils/uriReference";
import { handleServerError } from "./utils/responseUtils";
import { CONTEXT as FUNCTION_CONTEXT, Function } from "../models/functionModel";
import { CONTEXT as FAILURE_MODE_CONTEXT } from "../models/failureModeModel";
import JsonLdUtils from "../utils/JsonLdUtils";
import { simplifyReferences } from "@utils/utils";
import { Component } from "@models/componentModel";
import { CONTEXT, FaultTree } from "@models/faultTreeModel";
import { FailureMode } from "@models/failureModeModel";

export const addFailureMode = async (functionIri: string, failureModeIri: string): Promise<void> => {
  try {
    const fragment = extractFragment(functionIri);
    const createRequest = { uri: failureModeIri } as UriReference;

    await axiosClient.post(`/functions/${fragment}/failureModes`, createRequest, {
      headers: authHeaders(),
    });
  } catch (e) {
    console.log("Function Service - Failed to call /addFailureMode");
    const defaultMessage = "Failed to add failure mode";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};

export const findAllFunctions = async (): Promise<Function[]> => {
  try {
    const response = await axiosClient.get<Function[]>(`/functions`, {
      headers: authHeaders(),
    });
    return JsonLdUtils.compactAndResolveReferencesAsArray<Function>(response.data, FUNCTION_CONTEXT);
  } catch (e) {
    console.log("Function Service - Failed to call /functions");
    const defaultMessage = "Failed to load functions";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};

export const addRequiredFunction = async (functionUri: string, requiredFunctionUri: string): Promise<Function> => {
  try {
    const functionFragment = extractFragment(functionUri);
    const requiredFunctionFragment = extractFragment(requiredFunctionUri);
    const createRequest = { uri: requiredFunctionFragment } as UriReference;

    const response = await axiosClient.post(
      `/functions/${functionFragment}/requiredFunctions/${requiredFunctionFragment}`,
      createRequest,
      {
        headers: authHeaders(),
      },
    );

    return JsonLdUtils.compactAndResolveReferences<Function>(response.data, FUNCTION_CONTEXT);
  } catch (e) {
    console.log("Function Service - Failed to call addRequiredFunctions");
    const defaultMessage = "Failed to add required Function";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};

export const editFunction = async (f: Function): Promise<Function> => {
  try {
    const updateRequest = Object.assign({}, simplifyReferences(f), { "@context": FUNCTION_CONTEXT });
    const response = await axiosClient.put("/functions", updateRequest, {
      headers: authHeaders(),
    });
    return JsonLdUtils.compactAndResolveReferences<Function>(response.data, FUNCTION_CONTEXT);
  } catch (e) {
    console.log("Function Service - Failed to call /update");
    const defaultMessage = "Failed to update function";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};
export const getComponent = async (functionUri: string): Promise<Component> => {
  try {
    const functionFragment = extractFragment(functionUri);
    const response = await axiosClient.get<Component>(`/functions/${functionFragment}/getComponent`, {
      headers: authHeaders(),
    });
    return JsonLdUtils.compactAndResolveReferences<Component>(response.data, FUNCTION_CONTEXT);
  } catch (e) {
    console.log("Function Service - Failed to call /functions");
    const defaultMessage = "Failed to load component";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};

export const generateFDTree = async (functionUri: string, faultTreeName: string): Promise<FaultTree> => {
  try {
    const fragment = extractFragment(functionUri);
    const response = await axiosClient.post(
      `/faultTrees/${fragment}/generateFunctionalDependencies/${faultTreeName}`,
      {},
      {
        headers: authHeaders(),
      },
    );

    return JsonLdUtils.compactAndResolveReferences<FaultTree>(response.data, CONTEXT);
  } catch (e) {
    console.log("Fault Tree Service - Failed to call /generateRequiredFunctionsTree");
    const defaultMessage = "Failed to create fault tree";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};

export const getImpairedBehavior = async (functionUri: string): Promise<FailureMode[]> => {
  try {
    const fragment = extractFragment(functionUri);

    const response = await axiosClient.get(`/functions/${fragment}/impairedBehaviors`, {
      headers: authHeaders(),
    });
    return JsonLdUtils.compactAndResolveReferencesAsArray<FailureMode>(response.data, FAILURE_MODE_CONTEXT);
  } catch (e) {
    console.log("Function Service - Failed to call /getImpairedBehavior");
    const defaultMessage = "Failed to get impaired behaviors";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};

export const getTransitiveClosure = async (functionUri: string, type: string): Promise<string[]> => {
  try {
    const functionFragment = extractFragment(functionUri);
    const response = await axiosClient.get<string[]>(`/functions/${functionFragment}/${type}TransitiveClosure`, {
      headers: authHeaders(),
    });
    return response.data;
  } catch (e) {
    console.log("Function Service - Failed to call getTransitiveClosure");
    const defaultMessage = "Failed to load component";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};
