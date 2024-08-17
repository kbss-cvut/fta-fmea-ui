import { ROUTES } from "@utils/constants";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "@hooks/useSnackbar";
import { useUserAuth } from "@hooks/useUserAuth";

interface AppBarTitleContextType {
  appBarTitle: string;
  setAppBarTitle: React.Dispatch<React.SetStateAction<string>>;
  isModified: boolean;
  setIsModified: React.Dispatch<React.SetStateAction<boolean>>;
  showUnsavedChangesDialog: boolean;
  setShowUnsavedChangesDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

interface AppBarTitleProviderProps {
  children: ReactNode;
}

const categoryTitles = {
  [ROUTES.SYSTEMS]: "categories.systems",
  [ROUTES.FTA]: "categories.trees",
  [ROUTES.FMEA]: "categories.worksheets",
  [ROUTES.FHA]: "categories.tables",
};

const AppBarMainContext = createContext<AppBarTitleContextType>({
  appBarTitle: "",
  setAppBarTitle: () => {},
  isModified: false,
  setIsModified: () => {},
  showUnsavedChangesDialog: false,
  setShowUnsavedChangesDialog: () => {},
});

export const useAppBar = () => useContext(AppBarMainContext);

export const AppBarProvider = ({ children }: AppBarTitleProviderProps) => {
  const [appBarTitle, setAppBarTitle] = useState<string>("");
  const [isModified, setIsModified] = useState<boolean>(false);
  const [showUnsavedChangesDialog, setShowUnsavedChangesDialog] = useState<boolean>(false);
  const location = useLocation();
  const { t } = useTranslation();
  const [showSnackbar] = useSnackbar();
  const loggedUser = useUserAuth();
  const errorMessage = t("common.defaultErrorMsg");

  useEffect(() => {
    const title = getTitleFromPathname(location.pathname);
    if (!title) setAppBarTitle("");
    else {
      const translatedTitle = t(`${title}`);
      setAppBarTitle(translatedTitle);
    }
  }, [location.pathname, t]);

  const getTitleFromPathname = (pathname: string): string => {
    const parts = pathname.split("/");
    const lastPart = parts.pop();
    const title = categoryTitles[`/${lastPart}`];
    if (title) return title;
    return "";
  };

  return (
    <AppBarMainContext.Provider
      value={{
        appBarTitle,
        setAppBarTitle,
        isModified,
        setIsModified,
        showUnsavedChangesDialog,
        setShowUnsavedChangesDialog,
      }}
    >
      {children}
    </AppBarMainContext.Provider>
  );
};
