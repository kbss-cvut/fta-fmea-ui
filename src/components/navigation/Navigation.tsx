import React, { FC, useEffect, useState } from "react";
import { Box } from "@mui/material";
import SidePanel from "./SidePanel";
import { useLocation } from "react-router-dom";
import { ROUTES } from "@utils/constants";
import AppBar from "../appBar/AppBar";

interface SideNavigationProps {
  children?: React.ReactNode;
}

export const SIDE_PANEL_WIDTH = 240;
export const TOP_PANEL_HEIGHT = 64;

const calculateDynamicHeight = () => {
  return `calc(${window.innerHeight}px - ${TOP_PANEL_HEIGHT}px)`;
};

const Navigation: FC<SideNavigationProps> = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  const shouldHideSidePanel =
    path.includes(ROUTES.LOGIN) || path.includes(ROUTES.REGISTER) || path.includes("instance");
  const shouldHideTopPanel = path.includes(ROUTES.LOGIN) || path.includes(ROUTES.REGISTER);

  const [dynamicHeight, setDynamicHeight] = useState(() => calculateDynamicHeight());

  useEffect(() => {
    const handleResize = () => {
      setDynamicHeight(calculateDynamicHeight());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="stretch" height="100vh" overflow="hidden">
      {!shouldHideSidePanel && <SidePanel topPanelHeight={TOP_PANEL_HEIGHT} width={SIDE_PANEL_WIDTH} />}
      {!shouldHideTopPanel && <AppBar title="" topPanelHeight={TOP_PANEL_HEIGHT} />}
      <Box
        display="flex"
        flexDirection="column"
        overflow="hidden"
        flex="1"
        style={{
          marginLeft: shouldHideSidePanel ? 0 : SIDE_PANEL_WIDTH,
          marginTop: shouldHideTopPanel ? 0 : TOP_PANEL_HEIGHT,
        }}
      >
        <Box height={dynamicHeight} overflow="auto">
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Navigation;
