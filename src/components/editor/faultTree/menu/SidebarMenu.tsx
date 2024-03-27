import * as React from "react";
import useStyles from "./SidebarMenu.styles";
import { Paper } from "@mui/material";
import { ChildrenProps } from "@utils/hookUtils";

interface Props extends ChildrenProps {
  className: any;
}

const SidebarMenu = ({ children, className }: Props) => {
  const { classes } = useStyles();

  return (
    <div className={classes.sideMenuContainer}>
      <Paper className={classes.paper} elevation={1}>
        {children}
      </Paper>
    </div>
  );
};

export default SidebarMenu;
