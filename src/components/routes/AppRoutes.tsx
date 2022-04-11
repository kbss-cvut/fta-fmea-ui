import * as React from "react";
import Login from "@components/login/Login";
import Dashboard from "@components/dashboard/Dashboard";
import {HashRouter, Redirect, Route, Router, Switch} from "react-router-dom";
import Logout from "@components/Logout";
import PublicRoute from "@components/routes/PublicRoute";
import PrivateRoute from "@components/routes/PrivateRoute";
import Register from "@components/register/Register";
import {createHashHistory} from "history";
import {LoggedUserProvider} from "@hooks/useLoggedUser";
import {ROUTE_PARAMS, ROUTES} from "@utils/constants";
import FaultTreeDashboard from "@components/dashboard/FaultTreeDashboard";
import SystemDashboard from "@components/dashboard/SystemDashboard";
import FailureModesTableDashboard from "@components/dashboard/FailureModesTableDashboard";
import AdminDashboard from "@components/dashboard/AdminDashboard";
import AdminRoute from "@components/routes/AdminRoute";

export const appHistory = createHashHistory()

const AppRoutes = () => {
    return (
        <LoggedUserProvider>
            <Router history={appHistory}>
                <Switch>
                    {process.env.REACT_APP_ADMIN_REGISTRATION_ONLY === "true" 
                        ? <AdminRoute  path={ROUTES.REGISTER} component={Register} restricted={true} exact />
                        : <PublicRoute path={ROUTES.REGISTER} component={Register} restricted={true} exact />
                    }
                    <PublicRoute path={ROUTES.LOGIN} component={Login} restricted={true} exact/>
                    <AdminRoute path={ROUTES.ADMINISTRATION} component={AdminDashboard} restricted={true} exact/>

                    <PrivateRoute path={ROUTES.LOGOUT} component={Logout} exact/>

                    <PrivateRoute path={ROUTES.DASHBOARD} component={Dashboard} exact/>

                    <PrivateRoute path={ROUTES.SYSTEM + ROUTE_PARAMS.SYSTEM_FRAGMENT} component={SystemDashboard} exact/>
                    <PrivateRoute path={ROUTES.FTA + ROUTE_PARAMS.FTA_FRAGMENT} component={FaultTreeDashboard} exact/>
                    <PrivateRoute path={ROUTES.FMEA + ROUTE_PARAMS.FMEA_FRAGMENT} component={FailureModesTableDashboard} exact/>

                    <Route path="*" render={() => <Redirect to={ROUTES.DASHBOARD}/>}/>
                </Switch>
            </Router>
        </LoggedUserProvider>
    );
};

export default AppRoutes;