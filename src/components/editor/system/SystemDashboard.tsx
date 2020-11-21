import * as React from "react";
import {useParams} from "react-router-dom";
import AppBar from "@components/appBar/AppBar";
import DashboardContentProvider from "@hooks/DashboardContentProvider";
import {CssBaseline} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import useStyles from "@components/dashboard/Dashboard.styles";
import {composeFragment} from "@services/utils/uriIdentifierUtils";
import Editor from "@components/editor/faultTree/Editor";
import {CurrentSystemProvider} from "@hooks/useCurrentSystem";

const SystemDashboard = () => {
    const classes = useStyles();

    const {systemFragment} = useParams();
    const systemIri = composeFragment(systemFragment);

    return (
        <DashboardContentProvider>
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar title={'System'} showBackButton/>
                <Toolbar/>

                <CurrentSystemProvider systemIri={systemIri}>

                </CurrentSystemProvider>
            </div>
        </DashboardContentProvider>
    );
}

export default SystemDashboard;