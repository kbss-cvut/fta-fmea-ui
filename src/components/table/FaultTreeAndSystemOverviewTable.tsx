import React, { FC, useEffect, useState } from "react";
import { Box, Table, TableBody, TableContainer, TableHead } from "@mui/material";
import useStyles from "./FaultTreeOverviewTable.styles";
import { FaultTree } from "@models/faultTreeModel";
import { System } from "@models/systemModel";
import { useSelectedSystemSummaries } from "@hooks/useSelectedSystemSummaries";
import { getFilteredFaultTreesBySystem, getReorderedSystemsListbySystem } from "@utils/utils";
import FaultTreeTableHead from "./FaultTreeTableHead";
import SystemTableHead from "./SystemTableHead";
import FaultTreeTableBody from "./FaultTreeTableBody";
import SystemTableBody from "./SystemTableBody";
import FaultTreeFilters from "@components/filters/FaultTreeFilters";

interface FaultTreeOverviewTableProps {
  faultTrees: FaultTree[];
  systems?: System[];
  handleFaultTreeContextMenu?: (evt: any, faultTree: FaultTree) => void;
  handleSystemContextMenu?: (evt: any, system: System) => void;
  handleFilterChange?: (label: string, snsLabel: string) => Promise<void>;
}

const FaultTreeAndSystemOverviewTable: FC<FaultTreeOverviewTableProps> = ({
  faultTrees,
  systems,
  handleFaultTreeContextMenu,
  handleSystemContextMenu,
  handleFilterChange,
}) => {
  const { classes } = useStyles();
  const [selectedSystem, setSelectedSystem] = useSelectedSystemSummaries();

  const modifiedSystemsList = getReorderedSystemsListbySystem(systems, selectedSystem);
  const modifiedFaultTreesList = getFilteredFaultTreesBySystem(faultTrees, selectedSystem);

  return (
    <Box className={classes.tableContainer}>
      {faultTrees && <FaultTreeFilters onFilterChange={handleFilterChange} />}
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            {faultTrees && <FaultTreeTableHead />}
            {systems && <SystemTableHead />}
          </TableHead>
          <TableBody>
            <>
              {faultTrees && (
                <FaultTreeTableBody
                  faultTrees={modifiedFaultTreesList}
                  handleFaultTreeContextMenu={handleFaultTreeContextMenu}
                />
              )}
              {systems && (
                <SystemTableBody
                  systems={modifiedSystemsList}
                  handleSystemContextMenu={handleSystemContextMenu}
                  selectedSystem={selectedSystem}
                />
              )}
            </>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FaultTreeAndSystemOverviewTable;
