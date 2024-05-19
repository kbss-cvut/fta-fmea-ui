import { useContext } from "react";
import { AuthContext } from "@oidc/OidcAuthWrapper";
import { useLoggedUser } from "@hooks/useLoggedUser";
import { isUsingOidcAuth } from "@utils/OidcUtils";

export const useUserAuth = () => {
  const oidcAuthContext = useContext(AuthContext);
  const [loggedUser] = useLoggedUser();

  if (isUsingOidcAuth()) {
    return oidcAuthContext.user !== null;
  }
  return loggedUser.authenticated;
};
