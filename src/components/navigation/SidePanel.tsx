import { Box, Typography, useTheme } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ArticleIcon from "@mui/icons-material/Article";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@utils/constants";
import useStyles from "./SidePanel.styles";
import { useTranslation } from "react-i18next";

interface SidePanelProps {
  topPanelHeight: number;
  width: number;
}

const SidePanel: FC<SidePanelProps> = ({ topPanelHeight, width }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();
  const { classes } = useStyles();

  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | undefined>();

  useEffect(() => {
    setHoveredItemIndex(getActiveItem());
  }, [location.pathname]);

  const getActiveItem = () => menuItems.findIndex((item) => location.pathname.includes(item.route));

  const handleMenuItemClick = (route: string) => navigate(route);

  const menuItems = [
    {
      title: `${t("categories.systems")}`,
      icon: <SettingsIcon />,
      route: ROUTES.SYSTEMS,
    },
    {
      title: `${t("categories.trees")}`,
      icon: <AccountTreeIcon />,
      route: ROUTES.FTA,
    },
    {
      title: `${t("categories.worksheets")}`,
      icon: <ArticleIcon />,
      route: ROUTES.FMEA,
    },
    {
      title: `${t("categories.tables")}`,
      icon: <BackupTableIcon />,
      route: ROUTES.FHA,
    },
  ];

  return (
    <Box className={classes.container} width={width}>
      <Box style={{ marginTop: topPanelHeight }}>
        {menuItems.map((item, index) => {
          const isHighLighted = index === hoveredItemIndex || location.pathname.includes(item.route);
          const bgColor = isHighLighted ? theme.sidePanel.colors.hover : "transparent";
          const iconColor = isHighLighted ? theme.sidePanel.colors.iconActive : theme.sidePanel.colors.icon;
          const titleColor = isHighLighted ? theme.sidePanel.colors.textActive : theme.sidePanel.colors.text;
          return (
            <Box
              key={`${item.title}-${index}`}
              className={classes.menuItem}
              onMouseEnter={() => setHoveredItemIndex(index)}
              onMouseLeave={() => setHoveredItemIndex(undefined)}
              onClick={() => handleMenuItemClick(item.route)}
              style={{ backgroundColor: bgColor }}
            >
              <Box className={classes.iconContainer} style={{ color: iconColor }}>
                {item.icon}
              </Box>
              <Box display="flex" flexDirection="column">
                <Typography className={classes.title} style={{ color: titleColor }}>
                  {item.title}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default SidePanel;
