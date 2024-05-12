import React, { FC } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTranslation } from "react-i18next";
import useStyles from "./FaultTreeOverviewTable.styles";
import { FaultTree } from "@models/faultTreeModel";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@utils/constants";
import { extractFragment } from "@services/utils/uriIdentifierUtils";
import { System } from "@models/systemModel";
import { getModifiedSystemsList, getModifiedFaultTreesList } from "@utils/utils";

const faultTreeTableHeadCells = [
  "faultTreeOverviewTable.name",
  "faultTreeOverviewTable.aircraftType",
  "faultTreeOverviewTable.ata",
  "faultTreeOverviewTable.calculatedFailureRate",
  "faultTreeOverviewTable.fhaBasedFailureRate",
  "faultTreeOverviewTable.requiredFailureRate",
  "faultTreeOverviewTable.lastModified",
  "faultTreeOverviewTable.lastEditor",
  "faultTreeOverviewTable.status",
];

const systemTableHeadCells = ["faultTreeOverviewTable.name"];

interface FaultTreeOverviewTableProps {
  faultTrees?: FaultTree[];
  systems?: System[];
  handleFaultTreeContextMenu?: (evt: any, faultTree: FaultTree) => void;
  handleSystemContextMenu?: (evt: any, system: System) => void;
  selectedSystem?: string;
}

const FaultTreeAndSystemOverviewTable: FC<FaultTreeOverviewTableProps> = ({
  faultTrees,
  systems,
  handleFaultTreeContextMenu,
  handleSystemContextMenu,
  selectedSystem,
}) => {
  const navigate = useNavigate();
  const { classes } = useStyles();
  const { t } = useTranslation();

  const modifiedSystemsList = getModifiedSystemsList(systems, selectedSystem);
  const modifiedFaultTreesList = getModifiedFaultTreesList(faultTrees, selectedSystem);

  return (
    <Box className={classes.tableContainer}>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {faultTrees &&
                faultTreeTableHeadCells.map((headCell, index) => {
                  const styling = index === 0 ? classes.firstColumn : classes.tableHeaderCell;
                  return (
                    <TableCell key={index} className={styling}>
                      {t(headCell)}
                    </TableCell>
                  );
                })}
              {systems &&
                systemTableHeadCells.map((headCell, index) => {
                  const styling = index === 0 ? classes.systemFirstColumn : classes.tableHeaderCell;
                  return (
                    <TableCell key={index} className={styling}>
                      {t(headCell)}
                    </TableCell>
                  );
                })}
              <TableCell className={classes.emptyCell} />
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Will be changed and refactored in the future task with more data */}
            {faultTrees &&
              modifiedFaultTreesList.map((faultTree, rowIndex) => {
                const routePath = ROUTES.FTA + `/${extractFragment(faultTree.iri)}`;
                return (
                  <TableRow key={rowIndex} className={classes.noBorder}>
                    <TableCell className={classes.firstColumn}>{faultTree.name}</TableCell>
                    <TableCell className={classes.tableCell}></TableCell>
                    <TableCell className={classes.tableCell}></TableCell>
                    <TableCell className={classes.tableCell}></TableCell>
                    <TableCell className={classes.tableCell}></TableCell>
                    <TableCell className={classes.tableCell}>{faultTree.requiredFailureRate}</TableCell>
                    <TableCell className={classes.tableCell}></TableCell>
                    <TableCell className={classes.tableCell}></TableCell>
                    <TableCell className={classes.tableCell}>{/* <DoneIcon /> */}</TableCell>
                    <TableCell className={classes.tableCell}>
                      <Box className={classes.rowOptionsContainer}>
                        <Button variant="contained" className={classes.editButton} onClick={() => navigate(routePath)}>
                          {t("faultTreeOverviewTable.edit")}
                        </Button>
                        <MoreVertIcon
                          className={classes.moreButton}
                          onClick={(e: any) => handleFaultTreeContextMenu(e, faultTree)}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            {systems &&
              modifiedSystemsList.map((system, rowIndex) => {
                const routePath = ROUTES.SYSTEMS + `/${extractFragment(system.iri)}`;
                return (
                  <TableRow key={rowIndex} className={classes.noBorder}>
                    <TableCell className={classes.systemFirstColumn}>{system.name}</TableCell>
                    <TableCell className={classes.tableCell}>
                      <Box className={classes.rowOptionsContainer}>
                        <Button variant="contained" className={classes.editButton} onClick={() => navigate(routePath)}>
                          {t("faultTreeOverviewTable.edit")}
                        </Button>
                        <MoreVertIcon
                          className={classes.moreButton}
                          onClick={(e: any) => handleSystemContextMenu(e, system)}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FaultTreeAndSystemOverviewTable;
