import * as React from "react";
import { CssBaseline, Grid } from "@mui/material";
import { Toolbar, Container, Paper } from "@mui/material";
import useStyles from "./Dashboard.styles";
import { useState } from "react";
import CreateUser from "../register/CreateUser";

const AdminDashboard = () => {
  const { classes } = useStyles();
  const [, setAppBarTitle] = useState("Admin");

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Toolbar />
      <Grid alignItems="flex-start">
        <Container maxWidth="xs" style={{ margin: "0px" }}>
          <Paper style={{ padding: "20px" }}>
            <CreateUser setAppBarName={setAppBarTitle} />
          </Paper>
        </Container>
      </Grid>
    </div>
  );
};

export default AdminDashboard;
