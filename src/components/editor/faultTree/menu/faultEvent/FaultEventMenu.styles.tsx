import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme: Theme) => ({
  label: {
    fontWeight: "500",
    color: "#00000080",
    marginRight: 8,
  },
  labelRow: {
    display: "flex",
    flexDirection: "row",
  },
  divider: {
    marginTop: 8,
    marginBottom: 8,
  },
}));

export default useStyles;
