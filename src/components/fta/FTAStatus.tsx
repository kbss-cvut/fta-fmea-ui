import * as React from "react";
import { asArray } from "@utils/utils";
import { Typography } from "@mui/material";

export const statusMessages = (statusMessages: string | string[]) => {
  const _statusMessages = asArray(statusMessages);
  return _statusMessages.length > 1 ? (
    <ul style={{ fontSize: 16, margin: "0px", paddingInlineStart: "25px", paddingInlineEnd: "0px" }}>
      {_statusMessages.map((c) => (
        <li key={c}>{c}</li>
      ))}
    </ul>
  ) : _statusMessages.length == 1 ? (
    <Typography style={{ margin: "0px", paddingInlineStart: "20px", paddingInlineEnd: "0px", textAlign: "start" }}>
      {_statusMessages[0]}
    </Typography>
  ) : null;
};
