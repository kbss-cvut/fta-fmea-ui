import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material";

const useStyles = makeStyles()((theme: Theme) => ({
  title: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  languageToggler: {
    cursor: "pointer",
    marginLeft: 8,
    marginRight: 8,
    display: "flex",
    alignItems: "center",
    maxHeight: 24,
    userSelect: "none",
  },
  languageIcon: {
    fontSize: 16,
    marginRight: 2,
  },
  languageLabel: {
    width: 24,
  },
}));

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;
