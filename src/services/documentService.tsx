import axiosClient from "@services/utils/axiosUtils";
import { authHeaders } from "@services/utils/authUtils";

import JsonLdUtils from "@utils/JsonLdUtils";
import { handleServerError } from "@services/utils/responseUtils";
import { extractFragment } from "./utils/uriIdentifierUtils";
import { CONTEXT, DocumentModel } from "@models/documentModel";

export const importDocument = async (systemUri: string, documentId: string): Promise<void> => {
  try {
    const systemFragment = extractFragment(systemUri);

    await axiosClient.post(
      `/systems/${systemFragment}/documents`,
      {},
      {
        params: {
          documentId: documentId,
        },
        headers: authHeaders(),
      },
    );

    return new Promise((resolve) => resolve());
  } catch (e) {
    console.log("Document Service - Failed to call /import");
    const defaultMessage = "Failed to import document";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};

export const findAll = async (): Promise<DocumentModel[]> => {
  try {
    const response = await axiosClient.get<DocumentModel[]>("/documents", {
      headers: authHeaders(),
    });

    return JsonLdUtils.compactAndResolveReferencesAsArray<DocumentModel>(response.data, CONTEXT);
  } catch (e) {
    console.log("Document Service - Failed to call /findAll");
    const defaultMessage = "Failed to load documents";
    return new Promise((resolve, reject) => reject(handleServerError(e, defaultMessage)));
  }
};
