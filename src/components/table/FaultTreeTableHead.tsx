import React, { FC } from "react";
import { TableCell, TableRow } from "@mui/material";
import { useTranslation } from "react-i18next";
import useStyles from "./FaultTreeOverviewTable.styles";

const faultTreeTableHeadCells = [
  "faultTreeOverviewTable.name",
  "faultTreeOverviewTable.aircraftType",
  "faultTreeOverviewTable.sns",
  "faultTreeOverviewTable.calculatedFailureRate",
  "faultTreeOverviewTable.fhaBasedFailureRate",
  "faultTreeOverviewTable.requiredFailureRate",
  "faultTreeOverviewTable.lastModified",
  "faultTreeOverviewTable.created",
  "faultTreeOverviewTable.lastEditor",
];

const FaultTreeTableHead: FC = () => {
  const { t } = useTranslation();
  const { classes } = useStyles();

  return (
    <TableRow>
      {faultTreeTableHeadCells.map((headCell, index) => (
        <TableCell key={index} className={index === 0 ? classes.firstColumn : classes.tableHeaderCell}>
          {t(headCell)}
        </TableCell>
      ))}
      <TableCell></TableCell>
    </TableRow>
  );
};

export default FaultTreeTableHead;
