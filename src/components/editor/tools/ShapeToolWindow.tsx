import * as React from "react";
import {FailureMode} from "@models/failureModeModel";
import useStyles from "./ShapeToolWindow.styles";
import {Paper} from "@material-ui/core";

const ShapeToolWindow = (failureMode: FailureMode) => {
    const classes = useStyles()

    return (
        <Paper>
            {failureMode}
        </Paper>
    );
}

export default ShapeToolWindow;