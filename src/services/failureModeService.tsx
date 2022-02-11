import JsonLdUtils from "@utils/JsonLdUtils";
import {authHeaders} from "@services/utils/authUtils";
import axiosClient from "@services/utils/axiosUtils";
import {FailureMode, CONTEXT} from "@models/failureModeModel";
import {extractFragment} from "@services/utils/uriIdentifierUtils";
import {handleServerError} from "./utils/responseUtils";
import {deepOmit} from "@utils/lodashUtils";
import VocabularyUtils from "@utils/VocabularyUtils";

export const findAll = async (): Promise<FailureMode[]> => {
    try {
        const response = await axiosClient.get<FailureMode[]>(
            '/failureModes',
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferencesAsArray<FailureMode>(response.data, CONTEXT)
    } catch (e) {
        console.log('Failure Mode Service - Failed to call /findAll')
        const defaultMessage = "Failed to load failure modes";
        return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
    }
}

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
};

export const find = async (failureModeIri: string): Promise<FailureMode> => {
    try {
        const fragment = extractFragment(failureModeIri);

        const response = await axiosClient.get<FailureMode>(
            `/failureModes/${fragment}`,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<FailureMode>(response.data, CONTEXT)
    } catch (e) {
        console.log('Failure Mode Service - Failed to call /find')
        const defaultMessage = "Failed to load failure mode";
        return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
    }
}

export const update = async (failureMode: FailureMode): Promise<FailureMode> => {
    try {
        const updateFailureMode = deepOmit(failureMode, '@type')
        const updateRequest = Object.assign({}, updateFailureMode, {"@context": CONTEXT})

        const response = await axiosClient.put(
            '/failureModes',
            updateRequest,
            {
                headers: authHeaders()
            }
        )

        return JsonLdUtils.compactAndResolveReferences<FailureMode>(response.data, CONTEXT);
    } catch (e) {
        console.log('Failure Mode Service - Failed to call /update')
        const defaultMessage = "Failed to update failure mode";
        return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
    }
}

export const remove = async (failureModeIri: string): Promise<void> => {
    try {
        const fragment = extractFragment(failureModeIri);

        await axiosClient.delete(
            `/failureModes/${fragment}`,
            {
                headers: authHeaders()
            }
        )
        return new Promise((resolve) => resolve());
    } catch (e) {
        console.log('Failure Mode Service - Failed to call /remove')
        const defaultMessage = "Failed to remove failure mode";
        return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
    }
}

export const addFailureModeToFunction = async (functionIri: string, failureModeIri: string): Promise<void> => {
    try {
        const functionFragment = extractFragment(functionIri);
        const fmFragment = extractFragment(failureModeIri);

        await axiosClient.post(
            `/failureModes/${functionFragment}/impairedBehavior/${failureModeIri}`,
            {},
            {
                headers: authHeaders()
            }
        )

        return new Promise((resolve) => resolve());
    } catch (e) {
        console.log('Failure Mode Service - Failed to call /addFailureModeToFunction')
        const defaultMessage = "Failed to add failure mode";
        return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
    }
}
export const removeFailureModeToFunction = async (functionIri: string, failureModeIri: string): Promise<void> => {
    try {
        const functionFragment = extractFragment(functionIri);
        const fmFragment = extractFragment(failureModeIri);

        await axiosClient.delete(
            `/failureModes/${functionFragment}/impairedBehavior/${failureModeIri}`,
            {
                headers: authHeaders()
            }
        )

        return new Promise((resolve) => resolve());
    } catch (e) {
        console.log('Failure Mode Service - Failed to call /removeFailureModeToFunction')
        const defaultMessage = "Failed to remove failure mode";
        return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
    }
}


export const addDependantFailureMode = async (failureModeIri: string, dependantFailureModeIri: string, type: string): Promise<void> => {
    try {
        const fmIri= extractFragment(failureModeIri);
        const dependantFMIri = extractFragment(dependantFailureModeIri);

        await axiosClient.post(
            `/failureModes/${fmIri}/${type}/${dependantFMIri}`,
            {},
            {
                headers: authHeaders(),
            }
        );
        return new Promise((resolve) => resolve());
    } catch (e) {
        console.log("Failure Mode Service - Failed to call /addDependantFailureMode");
        const defaultMessage = "Failed to add failure mode";
        return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
    }
};
export const removeDependantFailureMode = async (failureModeIri: string, dependantFailureModeIri: string, type: string): Promise<void> => {
    try {
        const fmIri = extractFragment(failureModeIri);
        const dependantFMIri = extractFragment(dependantFailureModeIri);

        await axiosClient.delete(`/failureModes/${fmIri}/${type}/${dependantFMIri}`, {
            headers: authHeaders(),
        });

        return new Promise((resolve) => resolve());
    } catch (e) {
        console.log("Failure Mode Service - Failed to call /removeDependantFailureMode");
        const defaultMessage = "Failed to remove failure mode";
        return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
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
        console.log(e)
        console.log("Failure mode service - Failed to call /update");
        const defaultMessage = "Failed to update failure mode";
        return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
    }
};

export const getTransitiveClosure = async (failureModeUri: string, type: string): Promise<string[]> => {
    try {
      const failureModeFragment = extractFragment(failureModeUri);
      const response = await axiosClient.get<string[]>(`/failureModes/${failureModeFragment}/${type}TransitiveClosure`, {
        headers: authHeaders(),
      });
      return response.data
    } catch (e) {
      console.log("FailureMode Service - Failed to call getTransitiveClosure");
      const defaultMessage = "Failed to load component";
      return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
    }
  };
  