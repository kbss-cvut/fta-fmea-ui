import React from "react";
import PropTypes from "prop-types";
import { isUsingOidcAuth } from "../../utils/OidcUtils.js";

const IfInternalAuth = ({ children }) => {
  if (isUsingOidcAuth()) {
    return null;
  }
  return <>{children}</>;
};

IfInternalAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default IfInternalAuth;
