import {Redirect, Route} from "react-router-dom";
import * as React from "react";
import {useLoggedUser} from "@hooks/useLoggedUser";
import {ROUTES} from "@utils/constants";

const AdminRoute = ({component: Component, ...rest}) => {
    const [loggedUser] = useLoggedUser();

    return (
        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /login page
        <Route {...rest} render={props => (
            loggedUser && loggedUser.authenticated && loggedUser.roles.indexOf("ROLE_ADMIN") >= 0 ?
                <Component {...props} />
                : <div />
        )}/>
    );
};

export default AdminRoute;