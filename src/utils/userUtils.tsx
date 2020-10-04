import {User} from "@models/userModel";

const _userKey = "loggedUser"

export const isLoggedIn = () => {
    return getLoggedUser().authenticated;
}

export const setLoggedUser = (user: User) => {
    localStorage.removeItem(_userKey)

    if (user.authenticated) {
        localStorage.setItem(_userKey, JSON.stringify(user))
    }
}

export const getLoggedUser = (): User => {
    const item = localStorage.getItem(_userKey);

    if (item === undefined) {
        return {
            username: undefined,
            token: undefined,
            authenticated: false
        }
    }

    return JSON.parse(item)
}