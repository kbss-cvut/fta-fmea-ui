import * as React from "react";
import {createContext, useContext, useState} from "react";
import {User} from "@models/userModel";

type userContextType = [User, (user: User) => void];

export const loggedUserContext = createContext<userContextType>(null!);

export const useLoggedUser = () => {
    const [loggedUser, setLoggedUser] = useContext(loggedUserContext);
    return [loggedUser, setLoggedUser] as const;
}

const _userKey = "loggedUser"
export const getLoggedUser = (): User => {
    const item = localStorage.getItem(_userKey);

    if (!item) {
        return {
            authenticated: false
        }
    }

    return JSON.parse(item)
}

type LoggedUserProviderProps = {
    children: React.ReactNode;
};

export const LoggedUserProvider = ({children}: LoggedUserProviderProps) => {
    const [_user, _setLoggedUser] = useState<User>(getLoggedUser());

    const setLoggedUser = async (user: User) => {
        localStorage.removeItem(_userKey)

        if (user.authenticated) {
            localStorage.setItem(_userKey, JSON.stringify(user))
        }
        _setLoggedUser(user)
    }

    return (
        <loggedUserContext.Provider value={[_user, setLoggedUser]}>
            {children}
        </loggedUserContext.Provider>
    );
}