import * as React from "react";

import '@styles/App.scss';

import {MuiThemeProvider} from "@material-ui/core";
import AppRoutes from "@components/routes/AppRoutes";
import createCustomMuiTheme from "@styles/App.styles";

const theme = createCustomMuiTheme({
    appDrawer: {
        width: 240
    }
});

const App = () => {
    return (
        <MuiThemeProvider theme={theme}>
            <AppRoutes/>
        </MuiThemeProvider>
    );
}

export default App;