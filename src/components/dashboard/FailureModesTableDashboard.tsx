import * as React from "react";
import {useParams} from "react-router-dom";
import AppBar from "../appBar/AppBar";
import {CssBaseline} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import useStyles from "./Dashboard.styles";
import {composeFragment} from "@services/utils/uriIdentifierUtils";
import {useState} from "react";
import {CurrentFailureModesTableProvider} from "@hooks/useCurrentFailureModesTable";
import FailureModeTable from "../editor/failureMode/FailureModeTable";

const FailureModesTableDashboard = () => {
    const classes = useStyles();

    const {fmeaFragment} = useParams();
    const tableIri = composeFragment(fmeaFragment);

    const [appBarTitle, setAppBarTitle] = useState('FMEA Worksheet')

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar title={appBarTitle} showBackButton/>
            <Toolbar/>

            <CurrentFailureModesTableProvider tableIri={tableIri}>
                <FailureModeTable setAppBarName={setAppBarTitle}/>
            </CurrentFailureModesTableProvider>
        </div>
    );
}

export default FailureModesTableDashboard;