import {Theme} from "@mui/material";
import {makeStyles, createStyles} from "@mui/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            height: '100%',
            padding: theme.spacing(1)
        },
    }),
);

export default useStyles;