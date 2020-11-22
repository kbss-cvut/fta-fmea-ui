import * as React from "react";
import {useEffect} from "react";
import useStyles from "./FailureModeTable.styles";
import {DashboardTitleProps} from "../../dashboard/DashboardTitleProps";
import {useCurrentFailureMode} from "@hooks/useCurrentFailureMode";
import {useCurrentFailureModeComponent} from "@hooks/useCurrentFailureModeComponent";

const FailureModeTable = ({setAppBarName}: DashboardTitleProps) => {
    const classes = useStyles();

    const [failureMode] = useCurrentFailureMode();
    const [component] = useCurrentFailureModeComponent();

    useEffect(() => {
        setAppBarName(failureMode?.name)
    }, [failureMode])

    return (<div className={classes.root}/>)
}

export default FailureModeTable;