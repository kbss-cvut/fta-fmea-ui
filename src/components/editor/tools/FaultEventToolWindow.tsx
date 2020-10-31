import * as React from "react";
import {FailureMode} from "@models/failureModeModel";
import useStyles from "@components/editor/tools/FaultEventToolWindow.styles";
import {Paper} from "@material-ui/core";

const FaultEventToolWindow = (failureMode: FailureMode) => {
    const classes = useStyles()

    return (
        <Paper>
            {failureMode}
        </Paper>
    );
}

export default FaultEventToolWindow;