import {makeStyles} from "@material-ui/core";
import {createStyles, Theme} from "@material-ui/core/styles";

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
