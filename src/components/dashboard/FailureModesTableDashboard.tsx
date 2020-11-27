import * as React from "react";
import {useParams} from "react-router-dom";
import AppBar from "../appBar/AppBar";
import {CssBaseline, Fab} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import SaveIcon from '@material-ui/icons/Save';
import useStyles from "./Dashboard.styles";
import {composeFragment} from "@services/utils/uriIdentifierUtils";
import {useState} from "react";
import {CurrentFailureModesTableProvider} from "@hooks/useCurrentFailureModesTable";
import FailureModeTable from "../editor/failureMode/FailureModeTable";
import * as failureModesTableService from "@services/failureModesTableService";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";

const FailureModesTableDashboard = () => {
    const classes = useStyles();
    const [showSnackbar] = useSnackbar();

    const {fmeaFragment} = useParams();
    const tableIri = composeFragment(fmeaFragment);

    const [appBarTitle, setAppBarTitle] = useState('FMEA Worksheet')

    const handleExport = async () => {
        failureModesTableService
            .exportCsv(tableIri, appBarTitle)
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR));
    }

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar title={appBarTitle} showBackButton/>
            <Toolbar/>

            <CurrentFailureModesTableProvider tableIri={tableIri}>
                <FailureModeTable setAppBarName={setAppBarTitle}/>
            </CurrentFailureModesTableProvider>

            <Fab color="primary" aria-label="export" className={classes.fab} onClick={handleExport}>
                <SaveIcon />
            </Fab>
        </div>
    );
}

export default FailureModesTableDashboard;