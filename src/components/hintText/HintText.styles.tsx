import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material";

const useStyles = makeStyles()((theme: Theme) => ({
  container: {
    width: "100%",
  },
  innerContainer: {
    position: "relative",
    display: "inline-block",
  },
  toolTip: {
    position: "absolute",
    top: -6,
    right: -16,
  },
  hintFont: {
    fontSize: 12,
  },
}));

export default useStyles;
