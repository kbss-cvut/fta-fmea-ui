import * as React from "react";
import {useParams} from "react-router-dom";
import AppBar from "../appBar/AppBar";
import {CssBaseline} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import useStyles from "./Dashboard.styles";
import {composeFragment} from "@services/utils/uriIdentifierUtils";
import Editor from "../editor/system/Editor";
import {CurrentSystemProvider} from "@hooks/useCurrentSystem";
import {useState} from "react";

const SystemDashboard = () => {
    const classes = useStyles();

    const {systemFragment} = useParams();
    const systemIri = composeFragment(systemFragment);

    const [appBarTitle, setAppBarTitle] = useState('System')

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar title={appBarTitle} showBackButton/>
            <Toolbar/>

            <CurrentSystemProvider systemIri={systemIri}>
                <Editor setAppBarName={setAppBarTitle}/>
            </CurrentSystemProvider>
        </div>
    );
}

export default SystemDashboard;