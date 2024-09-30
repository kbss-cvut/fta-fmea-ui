import { SyncProblem, Warning } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import React from "react";

export const warnIcon = (message: any) => {
  return iconWithMessage(<Warning transform={"scale(0.88)"} />, message);
};

export const syncProblemIcon = (message: any) => {
  return iconWithMessage(<SyncProblem transform={"scale(0.88)"} />, message);
};

export const iconWithMessage = (icon, message: any) => {
  return <Tooltip title={message}>{icon}</Tooltip>;
};
