import axios from 'axios';
import {UserLoginRequest, UserLoginResponse} from "@models/userModel";

const login = async (loginRequest: UserLoginRequest): Promise<UserLoginResponse> => {
    console.log(`Sending to - ${process.env.BASE_API_URL}`)
    const response = await axios.post<UserLoginResponse>(
        `${process.env.BASE_API_URL}/auth/signin`,
        loginRequest
    )

    return response.data
}

const userService = {
    login
}

export default userService;

// TODO handle retry for expired tokens