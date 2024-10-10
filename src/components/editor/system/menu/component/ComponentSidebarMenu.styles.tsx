import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme: Theme) => ({
  menuTitle: {
    backgroundColor: "#1976D256",
    marginLeft: "-16px",
    marginRight: "-16px",
    paddingLeft: "8px",
    borderBottom: "inset",
  },
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
