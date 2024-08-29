import { SyncProblem, Warning } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import React from "react";

export const warnIcon = (message: string) => {
  return iconWithMessage(<Warning transform={"scale(0.9)"} />, message);
};

export const syncProblemIcon = (message: string) => {
  return iconWithMessage(<SyncProblem transform={"scale(0.9)"} />, message);
};

export const iconWithMessage = (icon, message: string) => {
  return <Tooltip title={message}>{icon}</Tooltip>;
};
