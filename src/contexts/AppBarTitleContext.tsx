import { ROUTES } from "@utils/constants";
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface AppBarTitleContextType {
  appBarTitle: string;
  setAppBarTitle: React.Dispatch<React.SetStateAction<string>>;
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

const AppBarTitleContext = createContext<AppBarTitleContextType>({ appBarTitle: "", setAppBarTitle: () => {} });

export const useAppBarTitle = () => useContext(AppBarTitleContext);

export const AppBarTitleProvider = ({ children }: AppBarTitleProviderProps) => {
  const [appBarTitle, setAppBarTitle] = useState<string>("");
  const location = useLocation();
  const { t } = useTranslation();

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

  return <AppBarTitleContext.Provider value={{ appBarTitle, setAppBarTitle }}>{children}</AppBarTitleContext.Provider>;
};
