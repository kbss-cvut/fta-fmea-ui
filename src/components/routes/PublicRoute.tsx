import {Redirect, Route} from "react-router-dom";
import * as React from "react";
import {useContext} from "react";
import UserContext from "@contexts/UserContext";

const PublicRoute = ({component: Component, restricted, ...rest}) => {
    const currentUser = useContext(UserContext)

    return (
        // restricted = false meaning public route
        // restricted = true meaning restricted route
        <Route {...rest} render={props => (
            currentUser.user && currentUser.user.authenticated && restricted ?
                <Redirect to="/dashboard"/>
                : <Component {...props} />
        )}/>
    );
};

export default PublicRoute;