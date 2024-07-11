import React, { FC } from "react";
import { TableCell, TableRow, Box, TableSortLabel } from "@mui/material";

interface FaultTreeTableHeadProps {
  sortConfig: { key: string; direction: "asc" | "desc" };
  onSortChange: (columnKey: string) => void;
  onFilterClick: (event: React.MouseEvent<HTMLElement>, type: string) => void;
}

const FaultTreeTableHead: FC<FaultTreeTableHeadProps> = ({ sortConfig, onSortChange, onFilterClick }) => {
  return (
    <TableRow>
      <TableCell>
        <Box display="flex" alignItems="center">
          <span onClick={(e) => onFilterClick(e, "label")} style={{ cursor: "pointer", marginRight: "8px" }}>
            FHA Label
          </span>
          <TableSortLabel
            active={true}
            direction={sortConfig.key === "label" ? sortConfig.direction : "asc"}
            onClick={() => onSortChange("label")}
          />
        </Box>
      </TableCell>
      <TableCell>Aircraft Type</TableCell>
      <TableCell>
        <Box display="flex" alignItems="center">
          <span onClick={(e) => onFilterClick(e, "snsLabel")} style={{ cursor: "pointer", marginRight: "8px" }}>
            SNS Label
          </span>
          <TableSortLabel
            active={true}
            direction={sortConfig.key === "snsLabel" ? sortConfig.direction : "asc"}
            onClick={() => onSortChange("snsLabel")}
          />
        </Box>
      </TableCell>
      <TableCell>Calculated Failure Rate</TableCell>
      <TableCell>FHA Based Failure Rate</TableCell>
      <TableCell>Required Failure Rate</TableCell>
      <TableCell>Last Modified</TableCell>
      <TableCell>
        <TableSortLabel
          active={true}
          direction={sortConfig.key === "date" ? sortConfig.direction : "desc"}
          onClick={() => onSortChange("date")}
        >
          Created
        </TableSortLabel>
      </TableCell>
      <TableCell>Last Editor</TableCell>
    </TableRow>
  );
};

export default FaultTreeTableHead;
