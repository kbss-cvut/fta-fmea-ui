import { SyncProblem, Warning } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import React from "react";

export const warnIcon = (message: any) => {
  return iconWithMessage(<Warning transform={"scale(0.88)"} />, message);
};

export const syncProblemIcon = (message: any, messageCount = 1) => {
  return iconWithMessage(
    <SyncProblem transform={"scale(0.88)"} />,
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
