import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme: Theme) => ({
  paper: {
    height: "100%",
    borderRadius: 0,
    padding: 0,
  },
  sideMenuContainer: {
    width: 400,
  },
}));

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;
