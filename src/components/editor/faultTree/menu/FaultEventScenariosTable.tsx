import * as React from "react";
import { useEffect, useState, FC } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { FaultEventScenario } from "../../../../models/faultEventScenario";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import useStyles from "./FaultEventScenariosTable.styles";

interface FaultEventScenariosTableProps {
  scenarios: FaultEventScenario[];
  onScenarioSelect: (scenario: FaultEventScenario) => void;
}

interface TableRow {
  cutsets: string[];
  probability: number;
}

const getScenarioTableRow = (item: FaultEventScenario) => {
  const cutsetsStrings = [];

  // Check if scenarioParts is an array
  if (Array.isArray(item.scenarioParts)) {
    for (const scenarioPart of item.scenarioParts) {
      const parts = scenarioPart.iri.split("/");
      const lastPart = parts[parts.length - 1];
      cutsetsStrings.push(lastPart);
    }
  } else {
    // scenarioParts is an object
    const parts = item.scenarioParts.iri.split("/");
    const lastPart = parts[parts.length - 1];
    cutsetsStrings.push(lastPart);
  }

  const row: TableRow = {
    cutsets: cutsetsStrings,
    probability: item.probability,
  };

  return row;
};
const FaultEventScenariosTable: FC<FaultEventScenariosTableProps> = ({ scenarios, onScenarioSelect }) => {
  const theme = useTheme();
  const { classes } = useStyles();
  const sortedList = scenarios.sort((a, b) => b.probability - a.probability);

  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (selectedScenarioIndex === undefined && scenarios && scenarios.length > 0) {
      setSelectedScenarioIndex(0);
    }
  }, [scenarios]);

  const handleRowClick = (scenario: FaultEventScenario, index: number) => {
    if (index === selectedScenarioIndex) return;
    else {
      onScenarioSelect(scenario);
      setSelectedScenarioIndex(index);
    }
  };

  return (
    <Box className={classes.tableContainer}>
      {/* Table Head */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cutset</TableCell>
              <TableCell>Probability</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      {/* Table Body */}
      <TableContainer className={classes.tableBodyContainer}>
        <Table>
          <TableBody>
            {sortedList &&
              sortedList.map((scenario, index) => {
                const sortedTableRow = getScenarioTableRow(scenario);
                const isSelected = index === selectedScenarioIndex;
                const bgColor = isSelected ? theme.sidePanel.colors.hover : "transparent";

                return (
                  <TableRow
                    key={`${scenario.toString()}-${index}`}
                    className={classes.tableRow}
                    onClick={() => handleRowClick(scenario, index)}
                    style={{ backgroundColor: bgColor }}
                  >
                    <TableCell className={classes.tableCell}>
                      {sortedTableRow.cutsets.map((cutset) => {
                        return <Typography style={{ fontSize: 14 }}>{cutset}</Typography>;
                      })}
                    </TableCell>
                    <TableCell>{sortedTableRow.probability}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FaultEventScenariosTable;
