import React, { FC, useEffect, useState } from "react";
import { Box } from "@mui/material";
import SidePanel from "./SidePanel";
import { useLocation } from "react-router-dom";
import { ROUTES } from "@utils/constants";
import AppBar from "../appBar/AppBar";
import { SIDE_PANEL_STATE_KEY } from "../../utils/constants";
import useStyles from "./Navigation.styles";
import { AppBarTitleProvider } from "../../contexts/AppBarTitleContext";
import DashboardContentProvider from "@hooks/DashboardContentProvider";

interface SideNavigationProps {
  children?: React.ReactNode;
}

export const SIDE_PANEL_WIDTH = 240;
export const SIDE_PANEL_COLLAPSED_WIDTH = 56;
export const TOP_PANEL_HEIGHT = 64;

const calculateDynamicHeight = () => {
  return `calc(${window.innerHeight}px - ${TOP_PANEL_HEIGHT}px)`;
};

const Navigation: FC<SideNavigationProps> = ({ children }) => {
  const { classes } = useStyles();
  const location = useLocation();
  const path = location.pathname;

  const [dynamicHeight, setDynamicHeight] = useState(() => calculateDynamicHeight());
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [showAnimation, setShowAnimation] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setDynamicHeight(calculateDynamicHeight());
    };

    if (localStorage.getItem(SIDE_PANEL_STATE_KEY) !== undefined) {
      setIsCollapsed(JSON.parse(localStorage.getItem(SIDE_PANEL_STATE_KEY)));
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidePanel = () => {
    setIsCollapsed(!isCollapsed);
    localStorage.setItem(SIDE_PANEL_STATE_KEY, JSON.stringify(!isCollapsed));
    setShowAnimation(true);
  };

  const shouldHideSidePanel =
    path.includes(ROUTES.LOGIN) || path.includes(ROUTES.REGISTER) || path.includes("instance");
  const shouldHideTopPanel = path.includes(ROUTES.LOGIN) || path.includes(ROUTES.REGISTER);
  const overflow = path.includes("instance") ? "hidden" : "auto";

  const mgTop = shouldHideTopPanel ? 0 : TOP_PANEL_HEIGHT;
  const mgLeft = shouldHideSidePanel ? 0 : isCollapsed ? SIDE_PANEL_COLLAPSED_WIDTH : SIDE_PANEL_WIDTH;

  return (
    <AppBarTitleProvider>
      <DashboardContentProvider>
        <Box className={classes.container}>
          {!shouldHideSidePanel && (
            <SidePanel
              topPanelHeight={TOP_PANEL_HEIGHT}
              width={SIDE_PANEL_WIDTH}
              collapsedWidth={SIDE_PANEL_COLLAPSED_WIDTH}
              isCollapsed={isCollapsed}
              toggleSidePanel={toggleSidePanel}
              showAnimation={showAnimation}
            />
          )}
          {!shouldHideTopPanel && (
            <AppBar title="" topPanelHeight={TOP_PANEL_HEIGHT} showBackButton={path.includes("instance")} />
          )}
          <Box
            className={classes.childrenContainer}
            style={{ marginLeft: mgLeft, marginTop: mgTop, transition: showAnimation ? "margin-left 0.3s" : "none" }}
          >
            <Box height={dynamicHeight} overflow={overflow}>
              {children}
            </Box>
          </Box>
        </Box>
      </DashboardContentProvider>
    </AppBarTitleProvider>
  );
};

export default Navigation;
