import * as React from "react";

import {MuiThemeProvider} from "@material-ui/core/styles";
import AppRoutes from "@components/routes/AppRoutes";
import {appTheme} from "@styles/App.styles";

const App = () => {
    return (
        <MuiThemeProvider theme={appTheme}>
            <AppRoutes/>
        </MuiThemeProvider>
    );
}

export default App;