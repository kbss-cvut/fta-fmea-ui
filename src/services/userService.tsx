import {
  ChangePasswordRequest,
  CONTEXT,
  UserLoginRequest,
  UserLoginResponse,
  UserRegisterRequest,
  UserRegisterResponse,
} from "@models/userModel";
import axiosClient from "@services/utils/axiosUtils";
import VocabularyUtils from "@utils/VocabularyUtils";
import { JSONLD, AUTH } from "@utils/constants";
import { authHeaders } from "@services/utils/authUtils";
import { handleServerError } from "@services/utils/responseUtils";

export const register = async (loginRequest: UserRegisterRequest): Promise<UserRegisterResponse> => {
  try {
    const jsonldRequest = Object.assign({ "@type": [VocabularyUtils.USER] }, loginRequest, { "@context": CONTEXT });

    const response = await axiosClient.post<UserRegisterResponse>("/auth/register", jsonldRequest, {
      headers: { "Content-type": JSONLD, ...authHeaders() },
    });

    return response.data;
  } catch (e) {
    console.log("Failed to call /register");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.user.register")));
  }
};

export const login = async (loginRequest: UserLoginRequest): Promise<UserLoginResponse> => {
  try {
    const response = await axiosClient.post<UserLoginResponse>("/auth/signin", loginRequest, {
      headers: { "Content-type": AUTH },
    });
    if (response.data.success || response.data.loggedIn) {
      return response.data;
    }
    return Promise.reject(response.data.errorMessage);
  } catch (e) {
    console.log("Failed to call /login");
    return Promise.reject(handleServerError(e, "error.user.login"));
  }
};

export const changePassword = async (changePasswordRequest: ChangePasswordRequest): Promise<void> => {
  try {
    await axiosClient.put<UserLoginResponse>("/auth/current", changePasswordRequest, {
      headers: authHeaders(),
    });

    new Promise<void>((resolve) => resolve());
  } catch (e) {
    console.log("Failed to call /current");
    return new Promise((resolve, reject) => reject(handleServerError(e, "error.user.passwordChange")));
  }
};
