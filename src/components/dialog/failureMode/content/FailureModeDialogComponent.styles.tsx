import {makeStyles} from "@material-ui/core";
import {createStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        divForm: {
            flexGrow: 1
        },
        addButtonDiv: {
            display: 'inline-flex'
        },
        addButton: {
            alignSelf: 'flex-end'
        },
        createButtonDiv: {
            display: 'flex',
            justifyContent: 'flex-end',
            padding: theme.spacing(2, 0, 0)
        },
        rpnBox: {
            display: 'flex',
            gap: '1em'
        }
    }),
);

export default useStyles;
