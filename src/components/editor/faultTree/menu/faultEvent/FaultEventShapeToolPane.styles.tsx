import {Theme} from "@mui/material";
import {makeStyles, createStyles} from "@mui/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        emptyTitle: {
            padding: theme.spacing(0, 2)
        },
    }),
);

export default useStyles;