import {makeStyles} from "@material-ui/core";
import {createStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
    createStyles({
        failureModes: {
            width: '100%'
        },
        actionButton: {
            alignSelf: 'flex-end'
        },
        editHeader:{
            display: 'flex',
            justifyContent: 'space-between'
        },
        closure :{
            color: "#A9A9A9"
        },
        menuPaper: {
            maxHeight: 500,
            maxWidth: 300
        }
    }),
);

export default useStyles;
