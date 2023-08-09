import * as React from "react";
import useStyles from "./SidebarMenu.styles";
import {Paper,} from "@mui/material";
import {ChildrenProps} from "@utils/hookUtils";

interface Props extends ChildrenProps {
    className: any,
}

const SidebarMenu = ({children, className}: Props) => {
    const classes = useStyles()

    return (
        <div className={className}>
        <Paper className={classes.paper} elevation={3}>
            {children}
        </Paper>
    </div>
    );
}

export default SidebarMenu;