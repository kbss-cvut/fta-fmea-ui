import { useContext } from "react";
import { AuthContext } from "@oidc/OidcAuthWrapper";
import { useInternalLoggedUser } from "@hooks/useInternalLoggedUser";
import { isUsingOidcAuth } from "@utils/OidcUtils";

export const useUserAuth = () => {
  const oidcAuthContext = useContext(AuthContext);
  const [loggedUser] = useInternalLoggedUser();

  if (isUsingOidcAuth()) {
    return oidcAuthContext.user !== null;
  }
  return loggedUser;
};
