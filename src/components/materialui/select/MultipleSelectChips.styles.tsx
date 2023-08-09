import {makeStyles} from "@mui/styles";
import {Theme} from "@mui/material"

const useStyles = makeStyles((theme: Theme) => ({
    container: {
        margin: theme.spacing(1, 0, 1),
        textAlign: "left",
    },
    chipsDiv: {
        marginTop: theme.spacing(2),
    },
    chip: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
    },
    formHelperText: {
        textAlign: "center",
    },
}));

export default useStyles;