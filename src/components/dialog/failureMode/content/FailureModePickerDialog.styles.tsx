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
        rpnBox: {
            display: 'flex',
            gap: '1em'
        }
    }),
);

export default useStyles;
