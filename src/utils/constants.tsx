import * as React from "react";

export const JSONLD = 'application/ld+json'

export const STORAGE_KEYS = {
    USER: "loggedUser",
}

const context = process.env.CONTEXT;

export const ROUTES = {
    REGISTER: context + "/register",
    LOGIN: context + "/login",
    LOGOUT: context + "/logout",

    DASHBOARD: context + "/",
    SYSTEM: context + "/system/",
    FTA: context + "/fta/",
    FMEA: context + "/fmea/",
}

export const ROUTE_PARAMS = {
    SYSTEM_FRAGMENT: ":systemFragment",
    FTA_FRAGMENT: ":treeFragment",
    FMEA_FRAGMENT: ":fmeaFragment",
}

export const SVG_PAN_ZOOM_OPTIONS = {
    center: false,
    zoomEnabled: true,
    panEnabled: false,
    controlIconsEnabled: true,
    fit: false,
    minZoom: 0.5,
    maxZoom: 2.5,
    zoomScaleSensitivity: 0.5
}