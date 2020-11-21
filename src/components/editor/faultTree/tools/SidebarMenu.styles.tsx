import {makeStyles} from "@material-ui/core";
import {createStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            height: '100%',
            padding: theme.spacing(1)
        },
    }),
);

export default useStyles;