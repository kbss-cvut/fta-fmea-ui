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
    }),
);

export default useStyles;
