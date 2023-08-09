import {withStyles} from "@mui/styles";
import MuiDialogActions from "@mui/material/DialogActions";
import {Theme} from "@mui/material"

export const DialogActions = withStyles((theme: Theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);