import {User} from "@models/UserContextProps";

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
            authenticated: false
        }
    }

    return JSON.parse(item)
}