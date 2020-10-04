import axios from 'axios';
import {UserLoginRequest, UserLoginResponse, UserRegisterRequest, UserRegisterResponse} from "@models/userModel";

const register = async (loginRequest: UserRegisterRequest): Promise<UserRegisterResponse> => {
    try {
        const response = await axios.post<UserRegisterResponse>(
            `${process.env.BASE_API_URL}/auth/register`,
            loginRequest
        )

        return response.data
    } catch (e) {
        console.log('Failed to call /register')
        return undefined;
    }
}

const login = async (loginRequest: UserLoginRequest): Promise<UserLoginResponse> => {
    try {
        const response = await axios.post<UserLoginResponse>(
            `${process.env.BASE_API_URL}/auth/signin`,
            loginRequest
        )

        return response.data
    } catch (e) {
        console.log('Failed to call /login')
        return undefined;
    }
}

const userService = {
    register,
    login
}

export default userService;

// TODO handle retry for expired tokens