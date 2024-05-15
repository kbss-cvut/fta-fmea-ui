import * as React from "react";
import { useParams } from "react-router-dom";
import useStyles from "./Dashboard.styles";
import { composeFragment } from "@services/utils/uriIdentifierUtils";
import { CurrentFaultTreeProvider } from "@hooks/useCurrentFaultTree";
import Editor from "../editor/faultTree/Editor";

const FaultTreeDashboard = () => {
  const { classes } = useStyles();

  const { treeFragment } = useParams();
  const treeIri = composeFragment(treeFragment);

  return (
    <div className={classes.root}>
      <CurrentFaultTreeProvider faultTreeIri={treeIri}>
        <Editor />
      </CurrentFaultTreeProvider>
    </div>
  );
};

export default FaultTreeDashboard;
