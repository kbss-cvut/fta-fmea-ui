import React, { useEffect } from "react";
import { getUserManager } from "@utils/OidcUtils";

const OidcSignInCallback = () => {
  useEffect(() => {
    getUserManager()
      .signinRedirectCallback()
      .then(() => {
        const searchParams = new URLSearchParams(location.search);
        if (!searchParams.has("forward_uri")) {
          throw Error("Missing parameter forward_uri");
        }
        const forwardUri = window.atob(searchParams.get("forward_uri"));
        window.location.replace(forwardUri);
      });
  }, []);

  return <p>Redirecting...</p>;
};

export default OidcSignInCallback;
