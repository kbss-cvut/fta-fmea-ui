import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme: Theme) => ({
  paper: {
    width: "100%",
    padding: theme.spacing(1),
    margin: theme.spacing(0.5, 0),
  },

  rpnBox: {
    padding: theme.spacing(0, 1),
    maxWidth: "50%",
    display: "flex",
    gap: "0.5em",
  },

  rpnBoxItem: {
    flexGrow: 1,
  },
}));

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;
