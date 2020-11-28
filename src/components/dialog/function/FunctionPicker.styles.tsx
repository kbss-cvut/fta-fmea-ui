import {makeStyles} from "@material-ui/core";
import {createStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        addButtonDiv: {
            display: 'inline-flex',
            width: '100%',
        },
        addButton: {
            alignSelf: 'flex-end'
        },
        autocomplete: {
            marginTop: theme.spacing(3),
        },
    }),
);

export default useStyles;
