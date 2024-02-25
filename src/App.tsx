import * as React from "react";
import { useEffect } from "react";
import { ThemeProvider, Theme, StyledEngineProvider } from "@mui/material/styles";
import AppRoutes from "@components/routes/AppRoutes";
import { appTheme } from "@styles/App.styles";
import { SnackbarProvider } from "@hooks/useSnackbar";
import { ConfirmDialogProvider } from "@hooks/useConfirmDialog";
import { ENVVariable } from "@utils/constants";
import { Suspense } from "react";

declare module "@mui/material/styles" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const App = () => {
  useEffect(() => {
    const changeAppTitle = () => {
      document.querySelector("title").textContent = ENVVariable.TITLE;
    };
    changeAppTitle();
  }, [document.querySelector("title").textContent]);

  return (
    <Suspense fallback="...loading">
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={appTheme}>
          <SnackbarProvider>
            <ConfirmDialogProvider>
              <AppRoutes />
            </ConfirmDialogProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </Suspense>
  );
};

export default App;
