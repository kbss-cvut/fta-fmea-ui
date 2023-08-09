import MuiDialogContent from "@mui/material/DialogContent";
import {Theme} from "@mui/material"
import {withStyles} from "@mui/styles"

export const DialogContent = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);