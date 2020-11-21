import * as React from "react";

export const JSONLD = 'application/ld+json'

export const STORAGE_KEYS = {
    USER: "loggedUser",
}

export const ROUTES = {
    REGISTER: "/register",
    LOGIN: "/login",
    LOGOUT: "/logout",

    DASHBOARD: "/",
    SYSTEM: "/system/",
    FTA: "/fta/",
    FMEA: "/fmea/",
}

export const ROUTE_PARAMS = {
    SYSTEM_FRAGMENT: ":systemFragment",
    FTA_FRAGMENT: ":treeFragment",
    FMEA_FRAGMENT: ":fmeaFragment",
}