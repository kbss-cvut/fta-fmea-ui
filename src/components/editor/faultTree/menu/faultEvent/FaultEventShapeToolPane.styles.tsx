import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme: Theme) => ({
  emptyTitle: {
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: "bold",
    color: theme.main.grey,
    padding: theme.spacing(10, 2),
  },
}));

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;
