import {makeStyles} from "@material-ui/core";
import {createStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        divForm: {
            flexGrow: 1
        },
        newEventTitle: {
            margin: theme.spacing(1, 0)
        },
        formControlDiv: {
            width: '100%',
        },
        formControl: {
            minWidth: 120,
            margin: theme.spacing(1, 0)
        },
        probability: {
            minWidth: 120,
        }
    }),
);

export default useStyles;
