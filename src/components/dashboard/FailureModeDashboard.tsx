import * as React from "react";
import {useParams} from "react-router-dom";
import AppBar from "../appBar/AppBar";
import {CssBaseline} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import useStyles from "./Dashboard.styles";
import {composeFragment} from "@services/utils/uriIdentifierUtils";
import {useState} from "react";
import {CurrentFailureModeProvider} from "../../hooks/useCurrentFailureMode";
import FailureModeTable from "../editor/failureMode/FailureModeTable";

const FailureModeDashboard = () => {
    const classes = useStyles();

    const {fmeaFragment} = useParams();
    const failureModeIri = composeFragment(fmeaFragment);

    const [appBarTitle, setAppBarTitle] = useState('FailureMode')

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar title={appBarTitle} showBackButton/>
            <Toolbar/>

            <CurrentFailureModeProvider failureModeIri={failureModeIri}>
                <FailureModeTable setAppBarName={setAppBarTitle}/>
            </CurrentFailureModeProvider>
        </div>
    );
}

export default FailureModeDashboard;