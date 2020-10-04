import {Redirect, Route} from "react-router-dom";
import * as React from "react";
import {useContext} from "react";
import UserContext from "@contexts/UserContext";

const PrivateRoute = ({component: Component, ...rest}) => {
    const currentUser = useContext(UserContext);

    return (
        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /login page
        <Route {...rest} render={props => (
            currentUser.user && currentUser.user.authenticated ?
                <Component {...props} />
                : <Redirect to="/login"/>
        )}/>
    );
};

export default PrivateRoute;