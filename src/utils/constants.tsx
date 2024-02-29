/**
 * Helper to make sure that all envs are defined and loaded properly
 * @param name env variable name (with the FTA_FMEA_ prefix)
 * @param defaultValue Default variable name
 */
const getEnv = (name: string, defaultValue?: string): string => {
  let ENV: ImportMetaEnv;
  if ((window as any).__config__ && Object.keys((window as any).__config__).length > 0) {
    ENV = {
      ...(window as any).__config__,
    };
  } else ENV = import.meta.env;

  const value = ENV[name] || defaultValue;
  if (value !== undefined) {
    return value;
  }
  throw new Error(`Missing environment variable: ${name}`);
};

export const ENVVariable = {
  API_URL: getEnv("FTA_FMEA_API_URL", "http://localhost:9999"),
  CONTEXT: getEnv("FTA_FMEA_CONTEXT", ""),
  ADMIN_REGISTRATION_ONLY: getEnv("FTA_FMEA_ADMIN_REGISTRATION_ONLY", "false"),
  TITLE: getEnv("FTA_FMEA_TITLE", "FTA/FMEA"),
};

export const JSONLD = "application/ld+json";

export const STORAGE_KEYS = {
  USER: "loggedUser",
};

export const ROUTES = {
  REGISTER: "/register",
  ADMINISTRATION: "/administration",
  LOGIN: "/login",
  LOGOUT: "/logout",

    DASHBOARD: "/",
    SYSTEMS: "/systems",
    FTA: "/fta",
    FMEA: "/fmea",
}

export const ROUTE_PARAMS = {
    SYSTEM_FRAGMENT: "/:systemFragment",
    FTA_FRAGMENT: "/:treeFragment",
    FMEA_FRAGMENT: "/:fmeaFragment",
}

export const SVG_PAN_ZOOM_OPTIONS = {
  center: false,
  zoomEnabled: true,
  panEnabled: false,
  controlIconsEnabled: true,
  fit: false,
  minZoom: 0.5,
  maxZoom: 2.5,
  zoomScaleSensitivity: 0.5,
};
