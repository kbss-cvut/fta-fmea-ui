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
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.document.import")));
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
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.document.findAll")));
  }
};
