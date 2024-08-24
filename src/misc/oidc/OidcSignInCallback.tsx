import React, { useEffect } from "react";
import { getUserManager } from "@utils/OidcUtils";

const OidcSignInCallback = () => {
  useEffect(() => {
    const key = "cb-in-progress";
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "in progress");
    getUserManager()
      .signinRedirectCallback()
      .then(() => {
        sessionStorage.removeItem(key);
        const searchParams = new URLSearchParams(location.search);
        if (!searchParams.has("forward_uri")) {
          throw Error("Missing parameter forward_uri");
        }
        const forwardUri = window.atob(searchParams.get("forward_uri"));
        window.location.replace(forwardUri);
      })
      .catch(() => {
        sessionStorage.removeItem(key);
      });
  }, []);

  return <p>Redirecting...</p>;
};

export default OidcSignInCallback;
