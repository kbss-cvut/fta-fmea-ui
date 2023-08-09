import {createStyles, makeStyles,} from "@mui/styles";

const useStyles = makeStyles(() => {
        return createStyles({
            root: {
                flexGrow: 1,
            },
            table: {
                minWidth: '100%',
            },
        })
    }
);

export default useStyles;