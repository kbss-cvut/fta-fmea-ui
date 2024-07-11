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
import { useFaultTrees } from "@hooks/useFaultTrees";
import FaultTreeFilters from "@components/filters/FaultTreeFilters";
import CircularProgress from "@mui/material/CircularProgress";

interface FaultTreeOverviewTableProps {
  systems?: System[];
  handleFaultTreeContextMenu?: (evt: any, faultTree: FaultTree) => void;
  handleSystemContextMenu?: (evt: any, system: System) => void;
}

const FaultTreeAndSystemOverviewTable: FC<FaultTreeOverviewTableProps> = ({
  systems,
  handleFaultTreeContextMenu,
  handleSystemContextMenu,
}) => {
  const { classes } = useStyles();
  const [selectedSystem, setSelectedSystem] = useSelectedSystemSummaries();
  const [faultTrees, , , , triggerFetch] = useFaultTrees();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    triggerFetch();
    setLoading(false);
  }, []);

  const modifiedSystemsList = getReorderedSystemsListbySystem(systems, selectedSystem);
  const modifiedFaultTreesList = getFilteredFaultTreesBySystem(faultTrees, selectedSystem);

  const handleFilterChange = async (label: string, snsLabel: string) => {
    setLoading(true);
    await triggerFetch({ label, snsLabel });
    setLoading(false);
  };

  return (
    <Box className={classes.tableContainer}>
      <FaultTreeFilters onFilterChange={handleFilterChange} />
      <TableContainer>
        <Table className={classes.table}>
          <TableHead>
            {faultTrees && <FaultTreeTableHead />}
            {systems && <SystemTableHead />}
          </TableHead>
          <TableBody>
            {loading ? (
              <CircularProgress />
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
                    selectedSystem={selectedSystem}
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
