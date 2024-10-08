import { SyncProblem, Warning } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import React from "react";

const transform = "scale(0.88)";

export const warnIcon = (message: any) => {
  return iconWithMessage(<Warning transform={transform} />, message);
};

export const syncProblemIcon = (message: any, messageCount = 1) => {
  return iconWithMessage(
    <SyncProblem transform={transform} />,
    message,
    messageCount && messageCount > 1 ? messageCount : null,
  );
};

export const iconWithMessage = (icon, message: any, label: string | number = "") => {
  return (
    <Tooltip title={message}>
      {icon} {<span style={{ verticalAlign: "top", position: "fixed" }}>{label}</span>}
    </Tooltip>
  );
};
