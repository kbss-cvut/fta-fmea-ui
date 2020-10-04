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

interface UserContextProps {
    user: User,
    setUser: Function
}


export {
    User,
    UserLoginRequest,
    UserLoginResponse,
    UserContextProps
};