import * as React from "react";
import {useParams} from "react-router-dom";
import AppBar from "@components/appBar/AppBar";
import DashboardContentProvider from "@hooks/DashboardContentProvider";
import {CssBaseline} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import useStyles from "@components/dashboard/Dashboard.styles";
import {composeFragment} from "@services/utils/uriIdentifierUtils";
import {CurrentFaultTreeProvider} from "@hooks/useCurrentFaultTree";
import Editor from "@components/editor/faultTree/Editor";

const FaultTreeDashboard = () => {
    const classes = useStyles();

    const {treeFragment} = useParams();
    const treeIri = composeFragment(treeFragment);

    return (
        <DashboardContentProvider>
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar title={'Fault Tree'} showBackButton/>
                <Toolbar/>

                <CurrentFaultTreeProvider faultTreeIri={treeIri}>
                    <Editor/>
                </CurrentFaultTreeProvider>
            </div>
        </DashboardContentProvider>
    );
}

export default FaultTreeDashboard;