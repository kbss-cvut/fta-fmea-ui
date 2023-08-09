import {createStyles, makeStyles} from "@mui/styles";
import {Theme} from "@mui/material";

const useStyles = makeStyles((theme: Theme) => {
        return createStyles({
            root: {
                flexGrow: 1,
                padding: theme.spacing(3)
            },
            speedDial: {
                position: 'fixed',
                bottom: theme.spacing(2),
                right: theme.spacing(2),
            },
            backdrop: {
                zIndex: 5,
            }
        })
    }
);

export default useStyles;