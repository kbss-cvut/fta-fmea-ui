import {makeStyles} from "@material-ui/core";
import {createStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
    createStyles({
        functions: {
            display: 'inline-flex',
            width: '100%',
        },
        button: {
            alignSelf: 'flex-end'
        },
    }),
);

export default useStyles;
