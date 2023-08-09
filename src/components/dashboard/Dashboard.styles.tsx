import {createStyles, makeStyles} from "@mui/styles";
import {Theme} from "@mui/material";

const useStyles = makeStyles((theme: Theme) => {
        return createStyles({
            root: {
                display: "flex",
                flexFlow: "column",
                height: "100vh"
            },
            fab: {
                zIndex: 5,
                position: 'absolute',
                bottom: theme.spacing(8),
                right: theme.spacing(2),
            },
        })
    }
);

export default useStyles;