import {makeStyles} from "@material-ui/core";
import {createStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        rpnBox: {
            padding: theme.spacing(0, 1),
            display: 'flex',
            gap: '0.5em'
        },
        rpnBoxItem: {
            flexGrow: 1,
        },
    }),
);

export default useStyles;
