import {Theme} from "@mui/material";
import {createStyles, makeStyles} from "@mui/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            width: '100%',
            padding: theme.spacing(1),
            margin: theme.spacing(0.5, 0),
        },
        rpnBox: {
            padding: theme.spacing(0, 1),
            maxWidth: '50%',
            display: 'flex',
            gap: '0.5em'
        },
        rpnBoxItem: {
            flexGrow: 1,
        },
    }),
);

export default useStyles;
