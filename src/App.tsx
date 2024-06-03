import * as React from "react";
import { useEffect } from "react";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import AppRoutes from "@components/routes/AppRoutes";
import { appTheme } from "@styles/App.styles";
import { SnackbarProvider } from "@hooks/useSnackbar";
import { ConfirmDialogProvider } from "@hooks/useConfirmDialog";
import { ENVVariable, SELECTED_LANGUAGE_KEY, PRIMARY_LANGUAGE } from "@utils/constants";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { InternalUserProvider } from "@hooks/useInternalLoggedUser";

declare module "@mui/material/styles" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const App = () => {
  const { i18n } = useTranslation();
  const storedLanguage = localStorage.getItem(SELECTED_LANGUAGE_KEY);

  useEffect(() => {
    if (storedLanguage) i18n.changeLanguage(storedLanguage);
    else i18n.changeLanguage(PRIMARY_LANGUAGE);
  }, [storedLanguage]);

  useEffect(() => {
    const changeAppTitle = () => {
      document.querySelector("title").textContent = ENVVariable.TITLE;
    };
    changeAppTitle();
  }, [document.querySelector("title").textContent]);

  return (
    <Suspense fallback="...loading">
      <StyledEngineProvider injectFirst>
        <InternalUserProvider>
          <ThemeProvider theme={appTheme}>
            <SnackbarProvider>
              <ConfirmDialogProvider>
                <AppRoutes />
              </ConfirmDialogProvider>
            </SnackbarProvider>
          </ThemeProvider>
        </InternalUserProvider>
      </StyledEngineProvider>
    </Suspense>
  );
};

export default App;
