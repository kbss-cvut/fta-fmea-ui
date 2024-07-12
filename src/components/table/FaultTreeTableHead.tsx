import React, { FC } from "react";
import { TableCell, TableRow, Box, TableSortLabel } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import useStyles from "./FaultTreeOverviewTable.styles";

interface FaultTreeTableHeadProps {
  sortConfig: { key: string; direction: "asc" | "desc" };
  onSortChange: (columnKey: string) => void;
  onFilterClick: (event: React.MouseEvent<HTMLElement>, type: string) => void;
  filterValues: { label: string; snsLabel: string };
}

const FaultTreeTableHead: FC<FaultTreeTableHeadProps> = ({ sortConfig, onSortChange, onFilterClick, filterValues }) => {
  const { classes } = useStyles();

  return (
    <TableRow>
      <TableCell className={classes.tableHeaderCell}>
        <Box display="flex" alignItems="center">
          <span onClick={(e) => onFilterClick(e, "label")} style={{ cursor: "pointer", marginRight: "8px" }}>
            FHA Label
          </span>
          {filterValues.label && <FilterListIcon />}
          <TableSortLabel
            active={sortConfig.key === "label"}
            direction={sortConfig.key === "label" ? sortConfig.direction : "asc"}
            onClick={() => onSortChange("label")}
          />
        </Box>
      </TableCell>
      <TableCell className={classes.tableHeaderCell}>Aircraft Type</TableCell>
      <TableCell className={classes.tableHeaderCell}>
        <Box display="flex" alignItems="center">
          <span onClick={(e) => onFilterClick(e, "snsLabel")} style={{ cursor: "pointer" }}>
            SNS Label
          </span>
          {filterValues.snsLabel && <FilterListIcon />}
          <TableSortLabel
            active={sortConfig.key === "snsLabel"}
            direction={sortConfig.key === "snsLabel" ? sortConfig.direction : "asc"}
            onClick={() => onSortChange("snsLabel")}
          />
        </Box>
      </TableCell>
      <TableCell className={classes.tableHeaderCell}>Calculated Failure Rate</TableCell>
      <TableCell className={classes.tableHeaderCell}>FHA Based Failure Rate</TableCell>
      <TableCell className={classes.tableHeaderCell}>Required Failure Rate</TableCell>
      <TableCell className={classes.tableHeaderCell}>Last Modified</TableCell>
      <TableCell className={classes.tableHeaderCell}>
        <Box display="flex" alignItems="center">
          Created
          <TableSortLabel
            active={sortConfig.key === "date"}
            direction={sortConfig.key === "date" ? sortConfig.direction : "desc"}
            onClick={() => onSortChange("date")}
          />
        </Box>
      </TableCell>
      <TableCell className={classes.tableHeaderCell}>Last Editor</TableCell>
    </TableRow>
  );
};

export default FaultTreeTableHead;
