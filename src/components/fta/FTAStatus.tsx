import * as React from "react";
import { asArray } from "@utils/utils";
import { Typography } from "@mui/material";

export const calculationStatusMessages = (statusCodes: string[], t: any) => {
  const _statusCodes = asArray(statusCodes);
  return _statusCodes.length > 1 ? (
    <ul style={{ fontSize: 16, margin: "0px", paddingInlineStart: "25px", paddingInlineEnd: "0px" }}>
      {_statusCodes.map((c) => (
        <li key={c}>{t(c)}</li>
      ))}
    </ul>
  ) : _statusCodes.length == 1 ? (
    <Typography style={{ margin: "0px", paddingInlineStart: "20px", paddingInlineEnd: "0px", textAlign: "start" }}>
      {t(_statusCodes[0])}
    </Typography>
  ) : null;
};
