import {makeStyles, createStyles} from "@mui/styles";

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
