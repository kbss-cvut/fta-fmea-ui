import { Navigate, Route } from "react-router-dom";
import * as React from "react";
import { useInternalLoggedUser } from "@hooks/useInternalLoggedUser";
import { ROUTES } from "@utils/constants";

// TODO: Fix temporary hack to support react-router v6
const Element = ({ component: Component, loggedUser, ...props }) => {
  return (
    <>
      {loggedUser && loggedUser.authenticated && loggedUser.roles.indexOf("ROLE_ADMIN") >= 0 ? (
        <Component {...props} />
      ) : (
        <div />
      )}
    </>
  );
};

const AdminRoute = ({ children }) => {
  const [loggedUser] = useInternalLoggedUser();

  if (!loggedUser && loggedUser.authenticated && loggedUser.roles.indexOf("ROLE_ADMIN") >= 0) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  return children;
};

export default AdminRoute;
