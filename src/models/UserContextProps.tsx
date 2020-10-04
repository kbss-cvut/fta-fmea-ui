type User = {
    username: string,
    authenticated: boolean
}

type UserContextProps = {
    user: User,
    setUser: Function
}


export {
    User,
    UserContextProps
};