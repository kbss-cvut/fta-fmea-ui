import {Redirect, Route} from "react-router-dom";
import * as React from "react";
import {useLoggedUser} from "@hooks/useLoggedUser";
import {ROUTES} from "@utils/constants";

const PrivateRoute = ({component: Component, ...rest}) => {
    const [loggedUser] = useLoggedUser();

    return (
        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /login page
        <Route {...rest} render={props => (
            loggedUser && loggedUser.authenticated ?
                <Component {...props} />
                : <Redirect to={ROUTES.LOGIN}/>
        )}/>
    );
};

export default PrivateRoute;