import MuiDialogContent from "@mui/material/DialogContent";
import { Theme } from "@mui/material";
import { withStyles } from "tss-react/mui";

export const DialogContent = withStyles(MuiDialogContent, (theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}));
