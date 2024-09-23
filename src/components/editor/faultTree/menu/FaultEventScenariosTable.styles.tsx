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
  tableRow: {
    display: "flex",
    alignItems: "stretch",
    cursor: "pointer",
  },
  tableCell: {
    padding: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  cutsetColumn: {
    flex: 2,
    display: "flex",
    flexDirection: "column",
  },
  cutsetItemsContainer: {
    display: "flex",
    flexDirection: "column",
  },
  cutsetItem: {
    fontSize: 14,
    marginBottom: theme.spacing(0.5),
  },
  probabilityColumn: {
    flex: 1,
    width: "100%",
    display: "flex",
    justifySelf: "flex-end",
  },
  cutsetColumnHeader: {
    flex: 2,
  },
  probabilityColumnHeader: {
    flex: 1,
  },
}));

export default useStyles;
