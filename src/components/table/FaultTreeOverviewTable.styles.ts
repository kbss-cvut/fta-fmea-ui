import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material";
import { CSSProperties } from "react";

const commonCellStyle: CSSProperties = {
  padding: 4,
  overflow: "hidden",
  textAlign: "left",
  verticalAlign: "middle",
  maxWidth: 72,
  fontWeight: "bold",
};

const useStyles = makeStyles()((theme: Theme) => ({
  tableContainer: {
    flex: 1,
    marginTop: 16,
  },
  table: {
    minWidth: 650,
  },
  tableHeaderCell: {
    flex: 1,
    padding: 4,
    overflow: "hidden",
    maxWidth: 72,
    fontWeight: "bold",
  },
  tableCell: {
    flex: 1,
    overflow: "hidden",
    padding: 8,
  },
  rowOptionsContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  editButton: {
    marginRight: 8,
  },
  moreButton: {
    cursor: "pointer",
  },
  emptyCell: {
    width: 1,
    overflow: "hidden",
  },
  noBorder: {
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  },
  firstColumn: {
    width: "15%",
    ...commonCellStyle,
  },
  systemFirstColumn: {
    ...commonCellStyle,
  },
}));

export default useStyles;
