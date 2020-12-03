import {makeStyles} from "@material-ui/core";
import {createStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        emptyTitle: {
            padding: theme.spacing(0, 2)
        },
    }),
);

export default useStyles;