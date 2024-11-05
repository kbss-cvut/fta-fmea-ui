import React, { FC, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableContainer,
  CircularProgress,
  TableRow,
  TableCell,
  TableHead,
  Popover,
  TextField,
  Button,
} from "@mui/material";
import useStyles from "./FaultTreeOverviewTable.styles";
import { FaultTree } from "@models/faultTreeModel";
import { System } from "@models/systemModel";
import { useSelectedSystemSummaries } from "@hooks/useSelectedSystemSummaries";
import { getFilteredFaultTreesBySystem, getReorderedSystemsListbySystem } from "@utils/utils";
import FaultTreeTableBody from "./FaultTreeTableBody";
import SystemTableBody from "./SystemTableBody";
import FaultTreeTableHead from "./FaultTreeTableHead";
import SystemTableHead from "./SystemTableHead";

interface FaultTreeOverviewTableProps {
  faultTrees?: FaultTree[];
  systems?: System[];
  loading: boolean;
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
  loading,
  handleFaultTreeContextMenu,
  handleSystemContextMenu,
  handleFilterChange,
  handleSortChange,
  sortConfig,
  selectedSystem,
}) => {
  const { classes } = useStyles();
  const [selectedSystemState, setSelectedSystem] = useSelectedSystemSummaries();

  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [filterType, setFilterType] = useState<null | string>(null);
  const [filterValues, setFilterValues] = useState({ label: "", snsLabel: "" });
  const [appliedFilters, setAppliedFilters] = useState({ label: "", snsLabel: "" });

  const initialSortConfig: { key: string; direction: "asc" | "desc" } = { key: "date", direction: "desc" };

  const modifiedSystemsList = getReorderedSystemsListbySystem(systems, selectedSystemState);
  const modifiedFaultTreesList = getFilteredFaultTreesBySystem(faultTrees, selectedSystem);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>, type: string) => {
    setFilterAnchorEl(event.currentTarget);
    setFilterType(type);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
    setFilterType(null);
  };

  const applyFilters = () => {
    setAppliedFilters(filterValues);
    handleFilterChange(filterValues.label, filterValues.snsLabel);
    handleFilterClose();
  };

  return (
    <Box className={classes.tableContainer}>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            {faultTrees && (
              <FaultTreeTableHead
                sortConfig={sortConfig || initialSortConfig}
                onSortChange={handleSortChange}
                onFilterClick={handleFilterClick}
                filterValues={appliedFilters}
              />
            )}
            {systems && <SystemTableHead />}
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  style={{ borderBottom: "none", verticalAlign: "middle", height: "50vh" }}
                  colSpan={10}
                  align={"center"}
                >
                  <CircularProgress size={100} />
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

      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box p={2} sx={{ display: "flex", alignItems: "center" }}>
          {filterType === "label" && (
            <TextField
              label="FHA Label"
              value={filterValues.label}
              onChange={(e) => setFilterValues({ ...filterValues, label: e.target.value })}
            />
          )}
          {filterType === "snsLabel" && (
            <TextField
              label="SNS Label"
              value={filterValues.snsLabel}
              onChange={(e) => setFilterValues({ ...filterValues, snsLabel: e.target.value })}
            />
          )}
          <Button onClick={applyFilters}>Apply</Button>
        </Box>
      </Popover>
    </Box>
  );
};

export default FaultTreeAndSystemOverviewTable;
