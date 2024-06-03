import * as React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { createHashHistory } from "history";
import { ROUTE_PARAMS, ROUTES, ENVVariable } from "@utils/constants";
import Login from "@components/login/Login";
import Logout from "@components/Logout";
import Register from "@components/register/Register";
import FaultTreeDashboard from "@components/dashboard/FaultTreeDashboard";
import SystemDashboard from "@components/dashboard/SystemDashboard";
import FailureModesTableDashboard from "@components/dashboard/FailureModesTableDashboard";
import AdminDashboard from "@components/dashboard/AdminDashboard";
import Navigation from "../navigation/Navigation";
import SystemsOverview from "../systems/SystemsOverview";
import FtaOverview from "../fta/FtaOverview";
import FmeaOverview from "../fmea/FmeaOverview";
import FhaOverview from "../fha/FhaOverview";
import OidcSignInCallback from "@oidc/OidcSignInCallback";
import OidcSilentCallback from "@oidc/OidcSilentCallback";
import { isUsingOidcAuth } from "@utils/OidcUtils";
import OidcAuthWrapper from "@oidc/OidcAuthWrapper";
import PublicRoute from "@components/routes/PublicRoute";
import PrivateRoute from "@components/routes/PrivateRoute";
import AdminRoute from "@components/routes/AdminRoute";

export const appHistory = createHashHistory();

const AppRoutes = () => {
  const routes = [
    {
      path: ROUTES.REGISTER,
      element: <Register />,
    },
    {
      path: ROUTES.LOGIN,
      element: <Login />,
    },
    { path: ROUTES.ADMINISTRATION, element: <AdminDashboard /> },
    {
      path: ROUTES.LOGOUT,
      element: <Logout />,
    },
    {
      path: ROUTES.SYSTEMS,
      element: <SystemsOverview />,
    },
    {
      path: ROUTES.SYSTEMS + ROUTE_PARAMS.SYSTEM_FRAGMENT,
      element: <SystemDashboard />,
    },
    {
      path: ROUTES.FTA,
      element: <FtaOverview />,
    },
    {
      path: ROUTES.FTA + ROUTE_PARAMS.FTA_FRAGMENT,
      element: <FaultTreeDashboard />,
    },
    {
      path: ROUTES.FMEA,
      element: <FmeaOverview />,
    },
    {
      path: ROUTES.FMEA + ROUTE_PARAMS.FMEA_FRAGMENT,
      element: <FailureModesTableDashboard />,
    },
    {
      path: ROUTES.FHA,
      element: <FhaOverview />,
    },
    {
      path: "/*",
      element: <SystemsOverview />,
    },
  ];

  const getElement = (path, element) => {
    switch (path) {
      case ROUTES.LOGIN:
        return <PublicRoute restricted={true}>{element}</PublicRoute>;
      case ROUTES.ADMINISTRATION:
        return <AdminRoute>{element}</AdminRoute>;
      case ROUTES.REGISTER:
        return ENVVariable.ADMIN_REGISTRATION_ONLY === "true" ? (
          <AdminRoute>
            <Register />
          </AdminRoute>
        ) : (
          <PublicRoute restricted={true}>
            <Register />
          </PublicRoute>
        );
      default:
        return (
          <Navigation>
            <PrivateRoute>{element}</PrivateRoute>
          </Navigation>
        );
    }
  };

  return (
    <BrowserRouter basename={ENVVariable.BASENAME} /*history={appHistory}*/>
      <Routes>
        <Route path={ROUTES.OIDC_SIGNIN_CALLBACK} element={<OidcSignInCallback />} />
        <Route path={ROUTES.OIDC_SILENT_CALLBACK} element={<OidcSilentCallback />} />

        {routes.map((r) => {
          if (isUsingOidcAuth()) {
            return (
              <Route
                key={r.path}
                path={r.path}
                element={
                  <OidcAuthWrapper>
                    <Navigation>{r.element}</Navigation>
                  </OidcAuthWrapper>
                }
              />
            );
          } else {
            return <Route key={r.path} path={r.path} element={getElement(r.path, r.element)} />;
          }
        })}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
