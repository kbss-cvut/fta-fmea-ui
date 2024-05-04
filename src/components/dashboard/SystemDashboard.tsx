import * as React from "react";
import { useParams } from "react-router-dom";
import useStyles from "./Dashboard.styles";
import { composeFragment } from "@services/utils/uriIdentifierUtils";
import Editor from "../editor/system/Editor";
import { CurrentSystemProvider } from "@hooks/useCurrentSystem";

const SystemDashboard = () => {
  const { classes } = useStyles();

  const { systemFragment } = useParams();
  const systemIri = composeFragment(systemFragment);

  return (
    <div className={classes.root}>
      <CurrentSystemProvider systemIri={systemIri}>
        <Editor />
      </CurrentSystemProvider>
    </div>
  );
};

export default SystemDashboard;
