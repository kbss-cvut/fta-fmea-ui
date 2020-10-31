import * as React from "react";

import {MuiThemeProvider} from "@material-ui/core/styles";
import AppRoutes from "@components/routes/AppRoutes";
import {appTheme} from "@styles/App.styles";
import {SnackbarProvider} from "@hooks/useSnackbar";

const App = () => {
    return (
        <MuiThemeProvider theme={appTheme}>
            <SnackbarProvider>
                <AppRoutes/>
            </SnackbarProvider>
        </MuiThemeProvider>
    );
}

export default App;