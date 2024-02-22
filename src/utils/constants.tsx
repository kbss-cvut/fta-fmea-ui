import * as React from "react";

/**
 * Aggregated object of process.env and window.__config__ to allow dynamic configuration
 */
const ENV = {
    ...Object.keys(import.meta.env).reduce<Record<string, string>>((acc, key) => {
        const strippedKey = key.replace("VITE_", "");
        acc[strippedKey] = import.meta.env[key]!;
        return acc;
    }, {}),
    ...(window as any).__config__,
};

/**
 * Helper to make sure that all envs are defined properly
 * @param name env variable name (without the REACT_APP prefix)
 * @param defaultValue Default variable name
 */
const getEnv = (name: string, defaultValue?: string): string => {
    const value = ENV[name] || defaultValue;
    if (value !== undefined) {
        return value;
    }
    throw new Error(`Missing environment variable: ${name}`);
}

export const environmentVariables = {
    API_URL: getEnv("API_URL","http://localhost:9999"),
    CONTEXT: getEnv("CONTEXT", ''),
    ADMIN_REGISTRATION_ONLY: getEnv("ADMIN_REGISTRATION_ONLY", "false"),
    TITLE: getEnv("TITLE", "FTA/FMEA Analysis")
}



export const JSONLD = 'application/ld+json'

export const STORAGE_KEYS = {
    USER: "loggedUser",
}

export const ROUTES = {
    REGISTER: "/register",
    ADMINISTRATION: "/administration",
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