import React, { FC } from "react";
import { Box } from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import { ViewType } from "./types";
import useStyles from "./FaultTreeOverviewToggler.styles";

interface FaultTreeOverviewTogglerProps {
  selectedView: ViewType;
  toggleView: (viewType: ViewType) => void;
}

const OverviewTypeToggler: FC<FaultTreeOverviewTogglerProps> = ({ selectedView, toggleView }) => {
  const { classes } = useStyles();

  const handleToggleView = (viewType: ViewType) => {
    toggleView(viewType);
  };

  return (
    <Box className={classes.togglerContainer}>
      {["card", "table"].map((viewType: ViewType) => (
        <Box
          key={viewType}
          className={selectedView === viewType ? classes.iconContainerSelected : classes.iconContainer}
          onClick={() => handleToggleView(viewType)}
        >
          {viewType === "card" ? <ViewModuleIcon /> : <ViewListIcon />}
        </Box>
      ))}
    </Box>
  );
};

export default OverviewTypeToggler;
