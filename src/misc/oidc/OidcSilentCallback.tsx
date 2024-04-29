import React, { useEffect } from "react";
import { getUserManager } from "@utils/OidcUtils";

const OidcSilentCallback = () => {
  useEffect(() => {
    getUserManager().signinSilentCallback();
  }, []);

  return <p />;
};

export default OidcSilentCallback;
