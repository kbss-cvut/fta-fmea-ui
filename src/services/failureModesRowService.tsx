import axiosClient from "./utils/axiosUtils";
import { authHeaders } from "./utils/authUtils";
import { handleServerError } from "./utils/responseUtils";
import { EditRowRpn } from "@models/failureModesRowModel";

export const update = async (rowRpnUpdate: EditRowRpn): Promise<void> => {
  try {
    await axiosClient.put("/failureModesRow", rowRpnUpdate, {
      headers: authHeaders(),
    });

    return new Promise((resolve) => resolve());
  } catch (e) {
    console.log("Failure Modes Row Service - Failed to call /update");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.failureModesRow.update")));
  }
};
