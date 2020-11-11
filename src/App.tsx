import * as React from "react";

import {MuiThemeProvider} from "@material-ui/core/styles";
import AppRoutes from "@components/routes/AppRoutes";
import {appTheme} from "@styles/App.styles";
import {SnackbarProvider} from "@hooks/useSnackbar";
import {ConfirmDialogProvider} from "@hooks/useConfirmDialog";

const App = () => {
    return (
        <MuiThemeProvider theme={appTheme}>
            <SnackbarProvider>
                <ConfirmDialogProvider>
                    <AppRoutes/>
                </ConfirmDialogProvider>
            </SnackbarProvider>
        </MuiThemeProvider>
    );
}

export default App;