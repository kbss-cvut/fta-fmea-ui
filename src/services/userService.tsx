import {
    CONTEXT,
    UserLoginRequest,
    UserLoginResponse,
    UserRegisterRequest,
    UserRegisterResponse
} from "@models/userModel";
import axiosClient from "@services/utils/axiosUtils";
import VocabularyUtils from "@utils/VocabularyUtils";
import {JSONLD} from "@utils/constants";


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
        return undefined;
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
        return undefined;
    }
}