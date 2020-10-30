import * as React from "react";

import {MuiThemeProvider} from "@material-ui/core/styles";
import {createMuiTheme} from "@material-ui/core/styles/";
import AppRoutes from "@components/routes/AppRoutes";
import createCustomMuiTheme from "@styles/App.styles";

const _defaultTheme = createMuiTheme();
export const appTheme = createCustomMuiTheme({
    appDrawer: {
        width: 240
    },
    editor: {
        shape: {
            padding: _defaultTheme.spacing(2),
            strokeWidth: 1,
            strokeColor: 'black'
        },
        fontSize: 15
    }
});

const App = () => {
    return (
        <MuiThemeProvider theme={appTheme}>
            <AppRoutes/>
        </MuiThemeProvider>
    );
}

export default App;