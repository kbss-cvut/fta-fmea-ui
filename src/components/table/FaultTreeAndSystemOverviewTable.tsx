import React, { FC, useState } from "react";
import { Box, Table, TableBody, TableContainer, CircularProgress, TableRow, TableCell, TableHead } from "@mui/material";
import useStyles from "./FaultTreeOverviewTable.styles";
import { FaultTree } from "@models/faultTreeModel";
import { System } from "@models/systemModel";
import { useSelectedSystemSummaries } from "@hooks/useSelectedSystemSummaries";
import { getFilteredFaultTreesBySystem, getReorderedSystemsListbySystem } from "@utils/utils";
import FaultTreeTableBody from "./FaultTreeTableBody";
import SystemTableBody from "./SystemTableBody";
import FaultTreeFilters from "@components/filters/FaultTreeFilters";
import FaultTreeTableHead from "./FaultTreeTableHead";
import SystemTableHead from "./SystemTableHead";

interface FaultTreeOverviewTableProps {
  faultTrees?: FaultTree[];
  systems?: System[];
  handleFaultTreeContextMenu?: (evt: any, faultTree: FaultTree) => void;
  handleSystemContextMenu?: (evt: any, system: System) => void;
  handleFilterChange?: (label: string, snsLabel: string) => Promise<void>;
  handleSortChange?: (columnKey: string) => Promise<void>;
  sortConfig?: { key: string; direction: "asc" | "desc" };
  selectedSystem?: System;
}

const FaultTreeAndSystemOverviewTable: FC<FaultTreeOverviewTableProps> = ({
  faultTrees,
  systems,
  handleFaultTreeContextMenu,
  handleSystemContextMenu,
  handleFilterChange,
  handleSortChange,
  sortConfig,
  selectedSystem,
}) => {
  const { classes } = useStyles();
  const [selectedSystemState, setSelectedSystem] = useSelectedSystemSummaries();
  const [loading, setLoading] = useState(false);

  const modifiedSystemsList = getReorderedSystemsListbySystem(systems, selectedSystemState);
  const modifiedFaultTreesList = getFilteredFaultTreesBySystem(faultTrees, selectedSystem);

  return (
    <Box className={classes.tableContainer}>
      {faultTrees && <FaultTreeFilters onFilterChange={handleFilterChange} />}

      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            {faultTrees && <FaultTreeTableHead sortConfig={sortConfig} onSortChange={handleSortChange} />}
            {systems && <SystemTableHead />}
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
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
                    selectedSystem={selectedSystemState}
                  />
                )}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FaultTreeAndSystemOverviewTable;
