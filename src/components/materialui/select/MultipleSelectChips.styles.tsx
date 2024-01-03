import { makeStyles } from 'tss-react/mui';
import {Theme} from "@mui/material"

const useStyles = makeStyles()((theme: Theme) => ({
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

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;