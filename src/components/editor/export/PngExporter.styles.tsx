import {makeStyles} from "@material-ui/core";
import {createStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        canvas: {
            margin: 'auto',
            border: '1px solid #000',
            display: 'block'
        },
    }),
);

export default useStyles;