import { Theme } from "@mui/material";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme: Theme) => ({
  divForm: {
    flexGrow: 1,
  },

  newEventTitle: {
    margin: theme.spacing(1, 0),
  },

  formControlDiv: {
    width: "100%",
  },

  formControl: {
    minWidth: 120,
    margin: theme.spacing(1, 0),
  },

  probability: {
    minWidth: 120,
  },

  sequenceProbability: {
    marginLeft: theme.spacing(1),
    minWidth: 160,
  },
}));

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;
