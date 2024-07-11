import React, { FC } from "react";
import { TableCell, TableRow } from "@mui/material";
import SortableTableHeader from "./SortableTableHeader";

interface FaultTreeTableHeadProps {
  sortConfig: { key: string; direction: "asc" | "desc" };
  onSortChange: (columnKey: string) => void;
}

const FaultTreeTableHead: FC<FaultTreeTableHeadProps> = ({ sortConfig, onSortChange }) => {
  return (
    <TableRow>
      <SortableTableHeader columnKey="label" label="FHA Label" sortConfig={sortConfig} onSortChange={onSortChange} />
      <TableCell>Aircraft Type</TableCell>
      <SortableTableHeader columnKey="snsLabel" label="SNS Label" sortConfig={sortConfig} onSortChange={onSortChange} />
      <TableCell>Calculated Failure Rate</TableCell>
      <TableCell>FHA Based Failure Rate</TableCell>
      <TableCell>Required Failure Rate</TableCell>
      <TableCell>Last Modified</TableCell>
      <SortableTableHeader columnKey="date" label="Created" sortConfig={sortConfig} onSortChange={onSortChange} />
      <TableCell>Last Editor</TableCell>
    </TableRow>
  );
};

export default FaultTreeTableHead;
