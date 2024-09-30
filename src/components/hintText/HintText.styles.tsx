import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material";

const useStyles = makeStyles()((theme: Theme) => ({
  hintFont: {
    fontSize: 16,
  },
  helpIcon: {
    transform: "scale(0.88)",
    color: "#777777",
  },
}));

export default useStyles;
