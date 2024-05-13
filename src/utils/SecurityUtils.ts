import { getOidcIdentityStorageKey } from "./OidcUtils";
import { ROLE } from "./constants.js";

export function getOidcToken() {
  const identityData = sessionStorage.getItem(getOidcIdentityStorageKey());
  return identityData ? JSON.parse(identityData) : {};
}

export function saveOidcToken(token) {
  sessionStorage.setItem(getOidcIdentityStorageKey(), JSON.stringify(token));
}

export function clearToken() {
  sessionStorage.removeItem(getOidcIdentityStorageKey());
}

export function isAdmin(currentUser) {
  return currentUser.role === ROLE.ADMIN;
}
