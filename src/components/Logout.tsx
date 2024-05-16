import * as React from "react";
import { useContext, useEffect } from "react";
import { User } from "@models/userModel";
import { useLoggedUser } from "@hooks/useLoggedUser";
import { isUsingOidcAuth } from "@utils/OidcUtils";
import { AuthContext } from "@oidc/OidcAuthWrapper";

const Logout = () => {
  const [_, setLoggedUser] = useLoggedUser();
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    if (isUsingOidcAuth()) {
      authCtx.logout();
    } else {
      setLoggedUser({
        authenticated: false,
      } as User);
    }
  }, []);

  return <div>Logging out!</div>;
};

export default Logout;
