import Login from "../login/Login";
import Dashboard from "../Dashboard";
import {Redirect, Route, BrowserRouter as Router, Switch} from "react-router-dom";
import * as React from "react";
import Logout from "../Logout";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import UserContext from "@contexts/UserContext";
import {useState} from "react";
import {User} from "@models/userModel";
import {getLoggedUser, setLoggedUser} from "@utils/userSessionUtils";
import Register from "@components/register/Register";

const AppRoutes = () => {
    const [currentUser, setCurrentUser] = useState<User>(getLoggedUser());
    const updateLoggedUser = (user: User) => {
        setLoggedUser(user)
        setCurrentUser(user)
    }

    return (
        <UserContext.Provider value={{user: currentUser, setUser: updateLoggedUser}}>
            <Router>
                <Switch>
                    <PublicRoute restricted={true} component={Register} path="/register" exact/>
                    <PublicRoute restricted={true} component={Login} path="/login" exact/>
                    <PrivateRoute component={Dashboard} path="/dashboard" exact/>
                    <PrivateRoute component={Logout} path="/logout" exact/>

                    <Route path="*" render={() => <Redirect to="/dashboard"/>}/>
                </Switch>
            </Router>
        </UserContext.Provider>
    );
};

export default AppRoutes;