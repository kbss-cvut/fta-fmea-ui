import * as React from "react";
import {useParams} from "react-router-dom";
import AppBar from "../appBar/AppBar";
import {CssBaseline, Grid} from "@material-ui/core";
import {Toolbar, Container, Paper} from "@material-ui/core";
import { sizing } from '@material-ui/system';
import useStyles from "./Dashboard.styles";
import {composeFragment} from "@services/utils/uriIdentifierUtils";
import Editor from "../editor/system/Editor";
import {CurrentSystemProvider} from "@hooks/useCurrentSystem";
import {useState} from "react";
import CreateUser from "../register/CreateUser";

const AdminDashboard = () => {
    const classes = useStyles();
    const [appBarTitle, setAppBarTitle] = useState('Admin')

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar title={appBarTitle} showBackButton/>
            <Toolbar/>
            <Grid alignItems="flex-start">
                <Container maxWidth="xs" style={{margin: "0px"}}>
                    <Paper style={{padding : "20px"}}>
                        <CreateUser setAppBarName={setAppBarTitle}/>
                    </Paper>
                </Container>
            </Grid>
        </div>
    );
}

export default AdminDashboard;