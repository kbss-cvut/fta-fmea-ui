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
                    <PublicRoute restricted={true} component={Register} path={ROUTES.REGISTER} exact/>
                    <PublicRoute restricted={true} component={Login} path={ROUTES.LOGIN} exact/>
                    <PrivateRoute component={Dashboard} path={ROUTES.DASHBOARD} exact/>
                    <PrivateRoute component={Logout} path={ROUTES.LOGOUT} exact/>

                    <Route path="*" render={() => <Redirect to={ROUTES.DASHBOARD}/>}/>
                </Switch>
            </Router>
        </LoggedUserProvider>
    );
};

export default AppRoutes;