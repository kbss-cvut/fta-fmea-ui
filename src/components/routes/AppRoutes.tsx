import * as React from "react";
import Login from "@components/login/Login";
import Dashboard from "@components/Dashboard";
import {Redirect, Route, Router, Switch} from "react-router-dom";
import Logout from "@components/Logout";
import PublicRoute from "@components/routes/PublicRoute";
import PrivateRoute from "@components/routes/PrivateRoute";
import Register from "@components/register/Register";
import {createBrowserHistory} from "history";
import {LoggedUserProvider} from "@hooks/useLoggedUser";

export const appHistory = createBrowserHistory()

const AppRoutes = () => {
    return (
        <LoggedUserProvider>
            <Router history={appHistory}>
                <Switch>
                    <PublicRoute restricted={true} component={Register} path="/register" exact/>
                    <PublicRoute restricted={true} component={Login} path="/login" exact/>
                    <PrivateRoute component={Dashboard} path="/dashboard" exact/>
                    <PrivateRoute component={Logout} path="/logout" exact/>

                    <Route path="*" render={() => <Redirect to="/dashboard"/>}/>
                </Switch>
            </Router>
        </LoggedUserProvider>
    );
};

export default AppRoutes;