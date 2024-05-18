import { ROUTES } from "@utils/constants";
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { System } from "@models/systemModel";
import * as systemService from "@services/systemService";
import { useSnackbar } from "@hooks/useSnackbar";
import { axiosSource } from "@services/utils/axiosUtils";
import { useLoggedUser } from "@hooks/useLoggedUser";

interface AppBarTitleContextType {
  appBarTitle: string;
  setAppBarTitle: React.Dispatch<React.SetStateAction<string>>;
  systemsList: System[];
  setSystemsList: React.Dispatch<React.SetStateAction<System[]>>;
  addSystemToList: (system: System) => void;
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
  systemsList: [],
  setSystemsList: () => {},
  addSystemToList: (system: System) => {},
});

export const useAppBar = () => useContext(AppBarMainContext);

export const AppBarProvider = ({ children }: AppBarTitleProviderProps) => {
  const [appBarTitle, setAppBarTitle] = useState<string>("");
  const [systemsList, setSystemsList] = useState<System[]>([]);
  const location = useLocation();
  const { t } = useTranslation();
  const [showSnackbar] = useSnackbar();
  const [loggedUser] = useLoggedUser();
  const errorMessage = t("common.defaultErrorMsg");

  useEffect(() => {
    const title = getTitleFromPathname(location.pathname);
    if (!title) setAppBarTitle("");
    else {
      const translatedTitle = t(`${title}`);
      setAppBarTitle(translatedTitle);
    }
  }, [location.pathname, t]);

  useEffect(() => {
    const fetchSystems = async () => {
      systemService
        .findAll()
        .then((value) => {
          setSystemsList(value);
        })
        .catch((reason) => showSnackbar(reason, errorMessage));
    };

    if (loggedUser) fetchSystems();

    return () => axiosSource.cancel("SystemsProvider - unmounting");
  }, []);

  const getTitleFromPathname = (pathname: string): string => {
    const parts = pathname.split("/");
    const lastPart = parts.pop();
    const title = categoryTitles[`/${lastPart}`];
    if (title) return title;
    return "";
  };

  const addSystemToList = (system: System) => {
    setSystemsList((state) => [...state, system]);
  };

  return (
    <AppBarMainContext.Provider value={{ appBarTitle, setAppBarTitle, systemsList, setSystemsList, addSystemToList }}>
      {children}
    </AppBarMainContext.Provider>
  );
};
