import { Navigate, Route } from "react-router-dom";
import * as React from "react";
import { useInternalLoggedUser } from "@hooks/useInternalLoggedUser";
import { ROUTES } from "@utils/constants";

// TODO: Fix temporary hack to support react-router v6
const Element = ({ component: Component, loggedUser, ...props }) => {
  return <>{loggedUser && loggedUser.authenticated ? <Component {...props} /> : <Navigate to={ROUTES.LOGIN} />}</>;
};

const PrivateRoute = ({ children, ...rest }) => {
  const [loggedUser] = useInternalLoggedUser();

  console.log("Private route");

  if (!(loggedUser && loggedUser.authenticated)) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  return children;

  // return (
  //     // Show the component only when the user is logged in
  //     // Otherwise, redirect the user to /login page
  //     <Route {...rest} element={<Element component={component} loggedUser={loggedUser}/>}/>
  // );
};

export default PrivateRoute;
