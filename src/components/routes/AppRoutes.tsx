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
import {ROUTES} from "@utils/constants";

export const appHistory = createBrowserHistory()

const AppRoutes = () => {
    return (
        <LoggedUserProvider>
            <Router history={appHistory}>
                <Switch>
                    <PublicRoute path={ROUTES.REGISTER} component={Register} restricted={true} exact/>
                    <PublicRoute path={ROUTES.LOGIN} component={Login} restricted={true} exact/>
                    <PrivateRoute path={ROUTES.LOGOUT} component={Logout} exact/>

                    <PrivateRoute path={ROUTES.DASHBOARD} component={Dashboard} exact/>
                    <PrivateRoute path={ROUTES.DASHBOARD} component={Dashboard} exact/>

                    <Route path="*" render={() => <Redirect to={ROUTES.DASHBOARD}/>}/>
                </Switch>
            </Router>
        </LoggedUserProvider>
    );
};

export default AppRoutes;