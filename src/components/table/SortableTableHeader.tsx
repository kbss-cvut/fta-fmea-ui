import React, { FC } from "react";
import { TableCell, TableSortLabel } from "@mui/material";

interface SortableTableHeaderProps {
  columnKey: string;
  label: string;
  sortConfig: { key: string; direction: "asc" | "desc" };
  onSortChange: (columnKey: string) => void;
}

const SortableTableHeader: FC<SortableTableHeaderProps> = ({ columnKey, label, sortConfig, onSortChange }) => {
  const handleSort = () => {
    onSortChange(columnKey);
  };

  return (
    <TableCell sortDirection={sortConfig.key === columnKey ? sortConfig.direction : false}>
      <TableSortLabel
        active={sortConfig.key === columnKey}
        direction={sortConfig.key === columnKey ? sortConfig.direction : "desc"}
        onClick={handleSort}
      >
        {label}
      </TableSortLabel>
    </TableCell>
  );
};

export default SortableTableHeader;
