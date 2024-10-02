import React, { FC } from "react";
import { TableCell, TableRow, Box, TableSortLabel } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import useStyles from "./FaultTreeOverviewTable.styles";
import { useTranslation } from "react-i18next";

interface FaultTreeTableHeadProps {
  sortConfig: { key: string; direction: "asc" | "desc" };
  onSortChange: (columnKey: string) => void;
  onFilterClick: (event: React.MouseEvent<HTMLElement>, type: string) => void;
  filterValues: { label: string; snsLabel: string };
}

const FaultTreeTableHead: FC<FaultTreeTableHeadProps> = ({ sortConfig, onSortChange, onFilterClick, filterValues }) => {
  const { classes } = useStyles();
  const { t } = useTranslation();
  return (
    <TableRow>
      <TableCell className={classes.tableHeaderCell}>
        <Box display="flex" alignItems="center">
          <span onClick={(e) => onFilterClick(e, "label")} style={{ cursor: "pointer", marginRight: "8px" }}>
            {t("faultTreeOverviewTable.name")}
          </span>
          {filterValues.label && <FilterListIcon />}
          <TableSortLabel
            active={sortConfig.key === "label"}
            direction={sortConfig.key === "label" ? sortConfig.direction : "asc"}
            onClick={() => onSortChange("label")}
          />
        </Box>
      </TableCell>
      <TableCell className={classes.tableHeaderCell}>{t("faultTreeOverviewTable.aircraftType")}</TableCell>
      <TableCell className={classes.tableHeaderCell}>
        <Box>
          <span onClick={(e) => onFilterClick(e, "snsLabel")} style={{ cursor: "pointer" }}>
            {t("faultTreeOverviewTable.sns")}
          </span>
          {filterValues.snsLabel && <FilterListIcon />}
          <TableSortLabel
            active={sortConfig.key === "snsLabel"}
            direction={sortConfig.key === "snsLabel" ? sortConfig.direction : "asc"}
            onClick={() => onSortChange("snsLabel")}
          />
        </Box>
      </TableCell>
      <TableCell className={classes.tableHeaderCell}>{t("faultTreeOverviewTable.calculatedFailureRate")}</TableCell>
      <TableCell className={classes.tableHeaderCell}>{t("faultTreeOverviewTable.fhaBasedFailureRate")}</TableCell>
      <TableCell className={classes.tableHeaderCell}>{t("faultTreeOverviewTable.requiredFailureRate")}</TableCell>
      <TableCell className={classes.tableHeaderCell}>{t("faultTreeOverviewTable.lastModified")}</TableCell>
      <TableCell className={classes.tableHeaderCell}>
        <Box>
          {t("faultTreeOverviewTable.created")}
          <TableSortLabel
            active={sortConfig.key === "date"}
            direction={sortConfig.key === "date" ? sortConfig.direction : "desc"}
            onClick={() => onSortChange("date")}
          />
        </Box>
      </TableCell>
      <TableCell className={classes.tableHeaderCell}>{t("faultTreeOverviewTable.lastEditor")}</TableCell>
    </TableRow>
  );
};

export default FaultTreeTableHead;
