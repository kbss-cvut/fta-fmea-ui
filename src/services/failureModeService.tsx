import JsonLdUtils from "@utils/JsonLdUtils";
import { authHeaders } from "@services/utils/authUtils";
import axiosClient from "@services/utils/axiosUtils";
import { FailureMode, CONTEXT } from "@models/failureModeModel";
import { extractFragment } from "@services/utils/uriIdentifierUtils";
import { handleServerError } from "./utils/responseUtils";
import { deepOmit } from "@utils/lodashUtils";
import { getCircularReplacer, simplifyReferencesOfReferences } from "@utils/utils";

export const findAll = async (): Promise<FailureMode[]> => {
  try {
    const response = await axiosClient.get<FailureMode[]>("/failureModes", {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferencesAsArray<FailureMode>(response.data, CONTEXT);
  } catch (e) {
    console.log("Failure Mode Service - Failed to call /findAll");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.failureMode.findAll")));
  }
};

export const find = async (failureModeIri: string): Promise<FailureMode> => {
  try {
    const fragment = extractFragment(failureModeIri);

    const response = await axiosClient.get<FailureMode>(`/failureModes/${fragment}`, {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferences<FailureMode>(response.data, CONTEXT);
  } catch (e) {
    console.log("Failure Mode Service - Failed to call /find");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.failureMode.find")));
  }
};

export const update = async (failureMode: FailureMode): Promise<FailureMode> => {
  try {
    const updateFailureMode = deepOmit(simplifyReferencesOfReferences(failureMode), "@type");
    const updateRequest = Object.assign({}, updateFailureMode, { "@context": CONTEXT });

    const response = await axiosClient.put("/failureModes", updateRequest, {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferences<FailureMode>(response.data, CONTEXT);
  } catch (e) {
    console.log("Failure Mode Service - Failed to call /update");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.failureMode.update")));
  }
};

export const remove = async (failureModeIri: string): Promise<void> => {
  try {
    const fragment = extractFragment(failureModeIri);

    await axiosClient.delete(`/failureModes/${fragment}`, {
      headers: authHeaders(),
    });
    return new Promise((resolve) => resolve());
  } catch (e) {
    console.log("Failure Mode Service - Failed to call /remove");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.failureMode.remove")));
  }
};

export const addFailureModeToFunction = async (failureModeIri: string, functionIri: string): Promise<void> => {
  try {
    const functionFragment = extractFragment(functionIri);
    const fmFragment = extractFragment(failureModeIri);

    await axiosClient.post(
      `/failureModes/${failureModeIri}/impairedBehavior/${functionFragment}`,
      {},
      {
        headers: authHeaders(),
      },
    );

    return new Promise((resolve) => resolve());
  } catch (e) {
    console.log("Failure Mode Service - Failed to call /addFailureModeToFunction");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.failureMode.add")));
  }
};
export const removeFailureModeToFunction = async (functionIri: string, failureModeIri: string): Promise<void> => {
  try {
    const functionFragment = extractFragment(functionIri);
    const fmFragment = extractFragment(failureModeIri);

    await axiosClient.delete(`/failureModes/${functionFragment}/impairedBehavior/${failureModeIri}`, {
      headers: authHeaders(),
    });

    return new Promise((resolve) => resolve());
  } catch (e) {
    console.log("Failure Mode Service - Failed to call /removeFailureModeToFunction");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.failureMode.remove")));
  }
};

export const addDependantFailureMode = async (
  failureModeIri: string,
  dependantFailureModeIri: string,
  type: string,
): Promise<void> => {
  try {
    const fmIri = extractFragment(failureModeIri);
    const dependantFMIri = extractFragment(dependantFailureModeIri);

    await axiosClient.post(
      `/failureModes/${fmIri}/${type}/${dependantFMIri}`,
      {},
      {
        headers: authHeaders(),
      },
    );
    return new Promise((resolve) => resolve());
  } catch (e) {
    console.log("Failure Mode Service - Failed to call /addDependantFailureMode");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.failureMode.add")));
  }
};
export const removeDependantFailureMode = async (
  failureModeIri: string,
  dependantFailureModeIri: string,
  type: string,
): Promise<void> => {
  try {
    const fmIri = extractFragment(failureModeIri);
    const dependantFMIri = extractFragment(dependantFailureModeIri);

    await axiosClient.delete(`/failureModes/${fmIri}/${type}/${dependantFMIri}`, {
      headers: authHeaders(),
    });

    return new Promise((resolve) => resolve());
  } catch (e) {
    console.log("Failure Mode Service - Failed to call /removeDependantFailureMode");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.failureMode.remove")));
  }
};

export const editFailureMode = async (failureMode: FailureMode): Promise<FailureMode> => {
  try {
    const updateRequest = Object.assign({}, JSON.parse(JSON.stringify(failureMode, getCircularReplacer())), {
      "@context": CONTEXT,
    });
    const response = await axiosClient.put("/failureModes", updateRequest, {
      headers: authHeaders(),
    });
    return JsonLdUtils.compactAndResolveReferences<FailureMode>(response.data, CONTEXT);
  } catch (e) {
    console.log(e);
    console.log("Failure mode service - Failed to call /update");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.failureMode.update")));
  }
};

export const getTransitiveClosure = async (failureModeUri: string, type: string): Promise<string[]> => {
  try {
    const failureModeFragment = extractFragment(failureModeUri);
    const response = await axiosClient.get<string[]>(`/failureModes/${failureModeFragment}/${type}TransitiveClosure`, {
      headers: authHeaders(),
    });
    return response.data;
  } catch (e) {
    console.log("FailureMode Service - Failed to call getTransitiveClosure");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.component.find")));
  }
};
