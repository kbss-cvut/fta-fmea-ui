import {
    ChangePasswordRequest,
    CONTEXT,
    UserLoginRequest,
    UserLoginResponse,
    UserRegisterRequest,
    UserRegisterResponse
} from "@models/userModel";
import axiosClient from "@services/utils/axiosUtils";
import VocabularyUtils from "@utils/VocabularyUtils";
import {JSONLD} from "@utils/constants";
import {authHeaders} from "@services/utils/authUtils";


export const register = async (loginRequest: UserRegisterRequest): Promise<UserRegisterResponse> => {
    try {
        const jsonldRequest = Object.assign(
            {"@type": [VocabularyUtils.USER]}, loginRequest, {"@context": CONTEXT}
        )

        const response = await axiosClient.post<UserRegisterResponse>(
            '/auth/register',
            jsonldRequest,
            {
                headers: {'Content-type': JSONLD}
            }
        )

        return response.data
    } catch (e) {
        console.log('Failed to call /register')
        return new Promise((resolve, reject) => reject("Registration failed"));
    }
}

export const login = async (loginRequest: UserLoginRequest): Promise<UserLoginResponse> => {
    try {
        const response = await axiosClient.post<UserLoginResponse>(
            '/auth/signin',
            loginRequest
        )

        return response.data
    } catch (e) {
        console.log('Failed to call /login')
        return new Promise((resolve, reject) => reject("Login failed"));
    }
}

export const changePassword = async (changePasswordRequest: ChangePasswordRequest): Promise<void> => {
    try {
        await axiosClient.put<UserLoginResponse>(
            '/auth/current',
            changePasswordRequest,
            {
                headers: authHeaders()
            }
        )

        new Promise(resolve => resolve());
    } catch (e) {
        console.log('Failed to call /current')
        return new Promise((resolve, reject) => reject("Password change failed."));
    }
}