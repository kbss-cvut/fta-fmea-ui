import {createStyles, makeStyles} from "@mui/styles";

const useStyles = makeStyles(() =>
    createStyles({
        creationBox: {
            display: 'inline-flex',
            width: '100%'
        },
        addButton: {
            alignSelf: 'flex-end'
        },
    }),
);

export default useStyles;
