import React, { FC } from "react";
import { TableCell, TableRow } from "@mui/material";
import { useTranslation } from "react-i18next";
import useStyles from "./FaultTreeOverviewTable.styles";

const systemTableHeadCells = ["faultTreeOverviewTable.name", "faultTreeOverviewTable.operationalHours"];

const SystemTableHead: FC = () => {
  const { t } = useTranslation();
  const { classes } = useStyles();

  return (
    <TableRow>
      {systemTableHeadCells.map((headCell, index) => (
        <TableCell key={index} className={index === 0 ? classes.systemFirstColumn : classes.tableHeaderCell}>
          {t(headCell)}
        </TableCell>
      ))}
      <TableCell></TableCell>
    </TableRow>
  );
};

export default SystemTableHead;
