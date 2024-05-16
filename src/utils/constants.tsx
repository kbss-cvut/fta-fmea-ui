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
  BASENAME: getEnv("FTA_FMEA_BASENAME", ""),
  ADMIN_REGISTRATION_ONLY: getEnv("FTA_FMEA_ADMIN_REGISTRATION_ONLY", "false"),
  TITLE: getEnv("FTA_FMEA_TITLE", "FTA/FMEA"),
  AUTHENTICATION: getEnv("FTA_FMEA_AUTHENTICATION", "internal"),
  AUTH_SERVER_URL: getEnv("FTA_FMEA_AUTH_SERVER_URL", ""),
  AUTH_CLIENT_ID: getEnv("FTA_FMEA_AUTH_CLIENT_ID", ""),
};

export const JSONLD = "application/ld+json";
export const AUTH = "multipart/form-data";

export const STORAGE_KEYS = {
  USER: "loggedUser",
};

export const ROUTES = {
  REGISTER: "/register",
  ADMINISTRATION: "/administration",
  LOGIN: "/login",
  LOGOUT: "/logout",
  OIDC_SIGNIN_CALLBACK: "/oidc-signin-callback",
  OIDC_SILENT_CALLBACK: "/oidc-silent-callback",

  DASHBOARD: "/",
  SYSTEMS: "/systems",
  FTA: "/fta",
  FMEA: "/fmea",
  FHA: "/fha",
};

export const ROUTE_PARAMS = {
  SYSTEM_FRAGMENT: "/:systemFragment",
  FTA_FRAGMENT: "/:treeFragment",
  FMEA_FRAGMENT: "/:fmeaFragment",
};

export const SIDE_PANEL_STATE_KEY = "isSidePanelCollapsed";

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

export const SELECTED_LANGUAGE_KEY = "default-fta-language";
export const PRIMARY_LANGUAGE = "en";
export const SECONDARY_LANGUAGE = "cs";
export const SELECTED_SYSTEM = "fta-selected-system";
export const SELECTED_VIEW = "fta-selected-view";

export const ROLE = {
  ADMIN: "Admin",
  REGULAR_USER: "Regular User",
};

export const HttpHeaders = {
  AUTHORIZATION: "Authorization",
  CONTENT_DISPOSITION: "content-disposition",
  LINK: "link",
};
