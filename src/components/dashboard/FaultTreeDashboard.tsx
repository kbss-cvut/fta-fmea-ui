import * as React from "react";
import { useParams } from "react-router-dom";
import AppBar from "../appBar/AppBar";
import { CssBaseline } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import useStyles from "./Dashboard.styles";
import { composeFragment } from "@services/utils/uriIdentifierUtils";
import { CurrentFaultTreeProvider } from "@hooks/useCurrentFaultTree";
import Editor from "../editor/faultTree/Editor";
import { useState } from "react";

const FaultTreeDashboard = () => {
  const { classes } = useStyles();

  const { treeFragment } = useParams();
  const treeIri = composeFragment(treeFragment);

  const [appBarTitle, setAppBarTitle] = useState("Fault Tree");

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar title={appBarTitle} showBackButton />
      <Toolbar />

      <CurrentFaultTreeProvider faultTreeIri={treeIri}>
        <Editor setAppBarName={setAppBarTitle} />
      </CurrentFaultTreeProvider>
    </div>
  );
};

export default FaultTreeDashboard;
