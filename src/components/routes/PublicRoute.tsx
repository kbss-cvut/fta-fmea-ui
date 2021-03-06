import {Redirect, Route} from "react-router-dom";
import * as React from "react";
import {useLoggedUser} from "@hooks/useLoggedUser";
import {ROUTES} from "@utils/constants";

const PublicRoute = ({component: Component, restricted, ...rest}) => {
    const [loggedUser] = useLoggedUser();

    return (
        // restricted = false meaning public route
        // restricted = true meaning restricted route
        <Route {...rest} render={props => (
            loggedUser && loggedUser.authenticated && restricted ?
                <Redirect to={ROUTES.DASHBOARD}/>
                : <Component {...props} />
        )}/>
    );
};

export default PublicRoute;