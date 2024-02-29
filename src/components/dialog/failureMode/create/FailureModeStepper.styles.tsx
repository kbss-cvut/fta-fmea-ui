import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme: Theme) => ({
  navigationButtonsDiv: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "1em",
    margin: theme.spacing(1, 0, 0, 0),
  },
}));

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;
