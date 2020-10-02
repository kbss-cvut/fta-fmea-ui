import * as React from "react";
import {HashRouter as Router, Switch, Route, Link} from "react-router-dom";

import '@styles/App.scss';
import Home from "@components/Home";
import Login from "@components/Login"

import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";

// TODO configure global theme
const theme = createMuiTheme({
    overrides: {

    }
});

const App = () => {
    return (
        <MuiThemeProvider theme={theme}>
            <Router>
                <div>
                    <nav>
                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                        </ul>
                    </nav>
                    <Switch>
                        <Route path="/login">
                            <Login/>
                        </Route>
                        <Route path="/">
                            <Home/>
                        </Route>
                    </Switch>
                </div>
            </Router>
        </MuiThemeProvider>
    );
}

export default App;