import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme: Theme) => ({
  tableContainer: {
    display: "flex",
    flexDirection: "column",
    height: `calc(100vh - 188px)`,
  },
  tableBodyContainer: {
    flex: 1,
    overflow: "auto",
  },
  tableCell: {
    display: "flex",
    flexDirection: "column",
  },
  tableRow: {
    cursor: "pointer",
  },
}));

export default useStyles;
