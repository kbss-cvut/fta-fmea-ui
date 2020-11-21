import * as React from "react";

export const JSONLD = 'application/ld+json'

export const STORAGE_KEYS = {
    USER: "loggedUser",
    DRAWER_OPEN: "drawerOpen",
    LAST_OPEN_TABS: "last_open_tabs",
}

export const ROUTES = {
    REGISTER: "/register",
    LOGIN: "/login",
    LOGOUT: "/logout",

    DASHBOARD: "/dashboard",
    SYSTEM: "/system/:systemFragment",
    FTA: "/fta/:treeFragment",
    FMEA: "/fmea/:fmeaFragment",
}