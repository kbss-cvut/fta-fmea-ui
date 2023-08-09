import * as React from "react";

import { ThemeProvider, Theme, StyledEngineProvider } from "@mui/material/styles";
import AppRoutes from "@components/routes/AppRoutes";
import {appTheme} from "@styles/App.styles";
import {SnackbarProvider} from "@hooks/useSnackbar";
import {ConfirmDialogProvider} from "@hooks/useConfirmDialog";


declare module '@mui/material/styles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const App = () => {
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={appTheme}>
                <SnackbarProvider>
                    <ConfirmDialogProvider>
                        <AppRoutes/>
                    </ConfirmDialogProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export default App;