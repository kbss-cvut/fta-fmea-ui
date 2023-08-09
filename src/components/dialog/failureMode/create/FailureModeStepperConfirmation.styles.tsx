import {createStyles, makeStyles} from "@mui/styles";
import { Theme } from "@mui/material"

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
        },
    }),
);

export default useStyles;