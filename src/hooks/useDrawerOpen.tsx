import * as React from "react";
import {createContext, useContext, useState} from "react";
import {STORAGE_KEYS} from "@utils/constants";
import {ChildrenProps} from "@utils/hookUtils";

type drawerOpenContextType = [boolean, (open: boolean) => void];

export const drawerOpenContext = createContext<drawerOpenContextType>(null!);

export const useDrawerOpen = () => {
    const [open, setIsOpen] = useContext(drawerOpenContext);
    return [open, setIsOpen] as const;
}

const getDrawerOpen = (): boolean => {
    const item = localStorage.getItem(STORAGE_KEYS.DRAWER_OPEN);

    if (item === null) {
        return true
    } else {
        return (item === "true") // weird JS conversion of string to boolean :O
    }
}

export const DrawerOpenProvider = ({children}: ChildrenProps) => {
    const [_drawerOpen, _setDrawerOpen] = useState<boolean>(getDrawerOpen());

    const setDrawerOpen = (open: boolean) => {
        localStorage.setItem(STORAGE_KEYS.DRAWER_OPEN, open.toString())
        _setDrawerOpen(open)
    }

    return (
        <drawerOpenContext.Provider value={[_drawerOpen, setDrawerOpen]}>
            {children}
        </drawerOpenContext.Provider>
    );
}