import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme: Theme) => ({
  label: {
    fontWeight: "500",
    color: "#00000080",
  },
}));

export default useStyles;
