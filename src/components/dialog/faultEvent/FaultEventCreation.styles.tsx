import {makeStyles} from "@material-ui/core";
import {createStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        divForm: {
            flexGrow: 1
        },
        rpnBox: {
            display: 'flex',
            gap: '1em'
        },
        formControl: {
            minWidth: 120,
            margin: theme.spacing(1, 0)
        },
    }),
);

export default useStyles;
