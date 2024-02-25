import { withStyles } from "tss-react/mui";
import MuiDialogActions from "@mui/material/DialogActions";
import { Theme } from "@mui/material";

export const DialogActions = withStyles(MuiDialogActions, (theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}));
