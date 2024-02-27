import * as React from "react";
import { createContext, useContext, useState } from "react";
import { User } from "@models/userModel";
import { STORAGE_KEYS } from "@utils/constants";
import { ChildrenProps } from "@utils/hookUtils";

type userContextType = [User, (user: User) => void];

export const loggedUserContext = createContext<userContextType>(null!);

export const useLoggedUser = () => {
  const [loggedUser, setLoggedUser] = useContext(loggedUserContext);
  return [loggedUser, setLoggedUser] as const;
};

export const getLoggedUser = (): User => {
  const item = localStorage.getItem(STORAGE_KEYS.USER);

  if (!item) {
    return {
      authenticated: false,
      roles: [],
    };
  }

  return JSON.parse(item);
};

export const LoggedUserProvider = ({ children }: ChildrenProps) => {
  const [_user, _setLoggedUser] = useState<User>(getLoggedUser());

  const setLoggedUser = async (user: User) => {
    localStorage.removeItem(STORAGE_KEYS.USER);

    if (user.authenticated) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
    _setLoggedUser(user);
  };

  return <loggedUserContext.Provider value={[_user, setLoggedUser]}>{children}</loggedUserContext.Provider>;
};
