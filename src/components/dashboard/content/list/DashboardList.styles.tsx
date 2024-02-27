import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material";

const useStyles = makeStyles()((theme: Theme) => {
  return {
    gridList: {
      padding: theme.spacing(1, 0),
      height: "auto",
    },
    gridListTile: {
      height: "100% !important",
    },
    card: {
      margin: theme.spacing(1),
    },
    cardTitle: {
      overflow: "hidden",
    },
  };
});

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;
