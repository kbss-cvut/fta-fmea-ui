import { Navigate, Route } from "react-router-dom";
import * as React from "react";
import { useLoggedUser } from "@hooks/useLoggedUser";
import { ROUTES } from "@utils/constants";

// TODO: Fix temporary hack to support react-router v6
const Element = ({ component: Component, loggedUser, restricted, ...props }) => {
  return (
    <>
      {loggedUser && loggedUser.authenticated && restricted ? (
        <Navigate to={ROUTES.DASHBOARD} />
      ) : (
        <Component {...props} />
      )}
    </>
  );
};

const PublicRoute = ({ children, restricted, ...rest }) => {
  const [loggedUser] = useLoggedUser();

  console.log("Public route");

  if (loggedUser && loggedUser.authenticated && restricted) {
    return <Navigate to={ROUTES.SYSTEMS} />;
  }

  return children;
  //
  // return (
  //     // restricted = false meaning public route
  //     // restricted = true meaning restricted route
  //     <Route {...rest} element={<Element component={component} loggedUser={loggedUser} restricted={restricted}/>}/>
  // );
};

export default PublicRoute;
