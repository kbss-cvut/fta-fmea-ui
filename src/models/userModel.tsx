interface User {
    username: string,
    token: string,
    authenticated: boolean
}

interface UserLoginRequest {
    username: string,
    password: string,
}

interface UserLoginResponse {
    username: string,
    token: string,
}

interface UserRegisterRequest extends UserLoginRequest {
}

interface UserRegisterResponse {
    uri: string
}

interface UserContextProps {
    user: User,
    setUser: Function
}


export {
    User,
    UserLoginRequest,
    UserLoginResponse,
    UserRegisterRequest,
    UserRegisterResponse,
    UserContextProps
};