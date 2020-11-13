import {Theme, withStyles} from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";

export const DialogContent = withStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);