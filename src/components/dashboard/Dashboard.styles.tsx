import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material";

const useStyles = makeStyles()((theme: Theme) => {
  return {
    root: {},
    fab: {
      zIndex: 5,
      position: "absolute",
      bottom: theme.spacing(8),
      right: theme.spacing(2),
    },
  };
});

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;
