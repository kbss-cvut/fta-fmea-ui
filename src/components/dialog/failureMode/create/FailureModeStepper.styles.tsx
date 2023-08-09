import {Theme} from "@mui/material";
import {createStyles, makeStyles} from "@mui/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        navigationButtonsDiv: {
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1em',
            margin: theme.spacing(1, 0, 0, 0)
        },
    }),
);

export default useStyles;
