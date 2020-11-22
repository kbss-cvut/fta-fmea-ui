import {makeStyles} from "@material-ui/core";
import {createStyles, Theme} from "@material-ui/core/styles";

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
