import { Component, CONTEXT, CreateComponent, UpdateComponent } from "@models/componentModel";
import { Function, CONTEXT as FUNCTION_CONTEXT } from "@models/functionModel";
import JsonLdUtils from "@utils/JsonLdUtils";
import { authHeaders } from "@services/utils/authUtils";
import axiosClient from "@services/utils/axiosUtils";
import VocabularyUtils from "@utils/VocabularyUtils";
import { extractFragment } from "@services/utils/uriIdentifierUtils";
import { FailureMode, CONTEXT as FAILURE_MODE_CONTEXT } from "@models/failureModeModel";
import { System } from "@models/systemModel";
import { flatten, filter } from "lodash";
import { handleServerError } from "@services/utils/responseUtils";
import { getCircularReplacer } from "@utils/utils";

export async function mergeComponents(iri: string, iri2: string): Promise<void> {
  try {
    const fragment1 = extractFragment(iri);
    const fragment2 = extractFragment(iri2);

    await axiosClient.post(
      `/components/mergeComponents/${fragment1}/${fragment2}`,
      {},
      {
        headers: authHeaders(),
      },
    );

    return new Promise<void>((resolve) => resolve());
  } catch (e) {
    console.log("Component Service - Failed to call /mergeComponents");
    const defaultMessage = "Failed to merge components";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
}

export const findAll = async (): Promise<Component[]> => {
  try {
    const response = await axiosClient.get<Component[]>("/components", {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferencesAsArray<Component>(response.data, CONTEXT);
  } catch (e) {
    console.log("Component Service - Failed to call /findAll");
    const defaultMessage = "Failed to load components";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};

export const create = async (component: CreateComponent): Promise<Component> => {
  try {
    const createRequest = Object.assign({ "@type": [VocabularyUtils.COMPONENT] }, component, { "@context": CONTEXT });

    const response = await axiosClient.post("/components", createRequest, {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferences<Component>(response.data, CONTEXT);
  } catch (e) {
    console.log("Component Service - Failed to call /create");
    const defaultMessage = "Failed to create component";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};

export const update = async (componentUpdate: UpdateComponent): Promise<Component> => {
  try {
    const response = await axiosClient.put("/components", componentUpdate, {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferences<Component>(response.data, CONTEXT);
  } catch (e) {
    console.log("Component Service - Failed to call /update");
    const defaultMessage = "Failed to update component";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};

export const functions = async (componentUri: string): Promise<Function[]> => {
  try {
    const fragment = extractFragment(componentUri);
    const response = await axiosClient.get<Function[]>(`/components/${fragment}/functions`, {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferencesAsArray<Function>(response.data, FUNCTION_CONTEXT);
  } catch (e) {
    console.log("Component Service - Failed to call /functions");
    const defaultMessage = "Failed to load functions";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};

export const failureModes = async (componentUri: string): Promise<FailureMode[]> => {
  try {
    const fragment = extractFragment(componentUri);
    const response = await axiosClient.get<FailureMode[]>(`/components/${fragment}/failureModes`, {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferencesAsArray<FailureMode>(response.data, FAILURE_MODE_CONTEXT);
  } catch (e) {
    console.log("Component Service - Failed to call /failureModes");
    const defaultMessage = "Failed to load failure modes";
    return new Promise((_resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};

export const addFunction = async (componentUri: string, f: Function): Promise<Function> => {
  try {
    const fragment = extractFragment(componentUri);
    const createRequest = Object.assign(
      { "@type": [VocabularyUtils.FUNCTION] },
      JSON.parse(JSON.stringify(f, getCircularReplacer())),
      { "@context": FUNCTION_CONTEXT },
    );
    const response = await axiosClient.post(`/components/${fragment}/functions`, createRequest, {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferences<Function>(response.data, CONTEXT);
  } catch (e) {
    console.log("Component Service - Failed to call create function");
    const defaultMessage = "Failed to create function";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};

export const addFunctionByURI = async (componentUri: string, functionUri: string): Promise<Function> => {
  try {
    const fragment = extractFragment(componentUri);
    const functionFragment = extractFragment(functionUri);

    const response = await axiosClient.post(
      `/components/${fragment}/functions/${functionFragment}`,
      {},
      {
        headers: authHeaders(),
      },
    );

    return JsonLdUtils.compactAndResolveReferences<Function>(response.data, CONTEXT);
  } catch (e) {
    console.log(e);
    console.log("Component Service - Failed to call add function by URI");
    const defaultMessage = "Failed to add existing function";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};

export const removeFunction = async (componentIri: string, functionIri: string) => {
  try {
    const componentFragment = extractFragment(componentIri);
    const functionFragment = extractFragment(functionIri);

    await axiosClient.delete(`/components/${componentFragment}/functions/${functionFragment}`, {
      headers: authHeaders(),
    });
    return new Promise<void>((resolve) => resolve());
  } catch (e) {
    console.log("Component Service - Failed to call /removeFunction");
    const defaultMessage = "Failed to remove function";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};

export const linkComponent = async (componentUri: string, linkUri: string): Promise<Component> => {
  try {
    const fragment = extractFragment(componentUri);
    const linkFragment = extractFragment(linkUri);

    const response = await axiosClient.post(`/components/${fragment}/linkComponent/${linkFragment}`, null, {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferences<Component>(response.data, CONTEXT);
  } catch (e) {
    console.log("Component Service - Failed to call /linkComponent");
    const defaultMessage = "Failed to link components";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};

export const unlinkComponent = async (componentUri: string): Promise<void> => {
  try {
    const fragment = extractFragment(componentUri);

    await axiosClient.delete(`/components/${fragment}/linkComponent`, {
      headers: authHeaders(),
    });

    return new Promise((resolve) => resolve());
  } catch (e) {
    console.log("Component Service - Failed to call /unlinkComponent");
    const defaultMessage = "Failed to unlink components";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};

export const remove = async (componentIri: string): Promise<void> => {
  try {
    const fragment = extractFragment(componentIri);

    await axiosClient.delete(`/components/${fragment}`, {
      headers: authHeaders(),
    });
    return new Promise((resolve) => resolve());
  } catch (e) {
    console.log("Component Service - Failed to call /remove");
    const defaultMessage = "Failed to remove component";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};

export const removeComponentReferences = (system: System, componentIri: string): System => {
  system.components = filter(flatten([system.components]), (o) => o.iri !== componentIri);

  system.components = flatten([system.components]).map((c) => {
    if (c?.linkedComponent?.iri === componentIri) {
      c.linkedComponent = undefined;
    }
    return c;
  });
  return system;
};

export const addFailureModeByURI = async (componentUri: string, failureModeUri: string): Promise<void> => {
  try {
    const fragment = extractFragment(componentUri);
    const functionFragment = extractFragment(failureModeUri);

    await axiosClient.post(
      `/components/${fragment}/failureModes/${functionFragment}`,
      {},
      {
        headers: authHeaders(),
      },
    );
    return new Promise((resolve) => resolve());
  } catch (e) {
    console.log("Component Service - Failed to call add failure mode by URI");
    const defaultMessage = "Failed to add existing failure mode";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};

export const addFailureMode = async (componentUri: string, failureMode: FailureMode): Promise<FailureMode> => {
  try {
    const componentFragment = extractFragment(componentUri);

    const createRequest = Object.assign(
      { "@type": [VocabularyUtils.FAILURE_MODE] },
      JSON.parse(JSON.stringify(failureMode, getCircularReplacer())),
      // failureMode,
      {
        "@context": FAILURE_MODE_CONTEXT,
      },
    );

    const response = await axiosClient.post(`/components/${componentUri}/failureModes`, createRequest, {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferences<FailureMode>(response.data, FAILURE_MODE_CONTEXT);
  } catch (e) {
    console.log("Component Service - Failed to call create failure mode");
    console.log(e);
    const defaultMessage = "Failed to create failure mode";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};

export const removeFailureMode = async (componentIri: string, failureModeUri: string) => {
  try {
    const componentFragment = extractFragment(componentIri);
    const failureModeFragment = extractFragment(failureModeUri);

    await axiosClient.delete(`/components/${componentFragment}/failureModes/${failureModeFragment}`, {
      headers: authHeaders(),
    });
    return new Promise<void>((resolve) => resolve());
  } catch (e) {
    console.log("Component Service - Failed to call /removeFailureMode");
    const defaultMessage = "Failed to remove failure mode";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};
